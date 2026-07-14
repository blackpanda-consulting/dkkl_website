import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

// Spec §9 / §11 / §12: authoritative payment confirmation.
// - Verify signature against the raw body.
// - Idempotent via the WebhookEvent ledger.
// - Handle payment.captured / payment.failed / refund.processed / refund.failed.
export async function POST(request: Request) {
  const raw = await request.text(); // raw body required for signature check
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!signature || !verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: RazorpayEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Idempotency: skip if we've already processed this event id.
  const eventId = event.id ?? `${event.event}:${signature.slice(0, 24)}`;
  const already = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (already) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  try {
    switch (event.event) {
      case "payment.captured": {
        const orderId = event.payload?.payment?.entity?.order_id;
        const paymentId = event.payload?.payment?.entity?.id;
        if (orderId) {
          await prisma.booking.updateMany({
            where: {
              razorpayOrderId: orderId,
              status: { in: ["PROVISIONAL", "PENDING", "FAILED"] },
            },
            data: {
              status: "PAID_PENDING_ADMISSION",
              razorpayPaymentId: paymentId ?? undefined,
            },
          });
        }
        break;
      }
      case "payment.failed": {
        const orderId = event.payload?.payment?.entity?.order_id;
        if (orderId) {
          // Keep the provisional booking (spec §11: allow retry); only mark
          // FAILED if it hasn't already been paid.
          await prisma.booking.updateMany({
            where: { razorpayOrderId: orderId, status: { in: ["PROVISIONAL", "PENDING"] } },
            data: { status: "FAILED" },
          });
        }
        break;
      }
      case "refund.processed": {
        const orderId = event.payload?.refund?.entity?.order_id;
        const refundId = event.payload?.refund?.entity?.id;
        if (orderId) {
          await prisma.booking.updateMany({
            where: { razorpayOrderId: orderId },
            data: { status: "REFUND_COMPLETED", refundId, refundStatus: "processed" },
          });
        }
        break;
      }
      case "refund.failed": {
        const orderId = event.payload?.refund?.entity?.order_id;
        if (orderId) {
          await prisma.booking.updateMany({
            where: { razorpayOrderId: orderId },
            data: { refundStatus: "failed" },
          });
        }
        break;
      }
      default:
        // Ignore unrelated events but still record them as processed.
        break;
    }

    await prisma.webhookEvent.create({ data: { id: eventId, type: event.event } });
  } catch (e) {
    console.error("Webhook processing error", e);
    // Return 500 so Razorpay retries; we haven't recorded the event id yet.
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

type RazorpayEvent = {
  id?: string;
  event: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
    refund?: { entity?: { id?: string; order_id?: string } };
  };
};
