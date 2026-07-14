import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyCheckoutSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

// Spec §9 step 8: verify the checkout signature server-side. This is the
// optimistic path that runs from the browser success handler; the webhook is
// the authoritative confirmation.
export async function POST(request: Request) {
  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const valid = verifyCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!valid) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Only advance a not-yet-finalised booking; don't regress a webhook-confirmed one.
  if (booking.status === "PROVISIONAL" || booking.status === "PENDING") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "PAID_PENDING_ADMISSION",
        razorpayPaymentId: razorpay_payment_id,
      },
    });
  }

  return NextResponse.json({ ok: true, bookingRef: booking.bookingRef });
}
