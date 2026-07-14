import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { razorpay } from "@/lib/razorpay";
import { bookingSchema } from "@/lib/booking-schema";
import { computePrice } from "@/lib/pricing";

export const runtime = "nodejs";

// Spec §9 / §12: create the order server-side. NEVER trust a browser-supplied
// amount — recompute from the DB-configured rate.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Authoritative pricing from the DB.
  const settings = await getSettings();
  const price = computePrice(data.months, settings.monthlyRatePaise, settings.depositPaise);

  // Generate a human booking ref + provisional record in one transaction.
  const year = new Date().getFullYear();
  const booking = await prisma.$transaction(async (tx) => {
    const counter = await tx.counter.upsert({
      where: { year },
      update: { seq: { increment: 1 } },
      create: { year, seq: 1 },
    });
    const bookingRef = `KL-${year}-${String(counter.seq).padStart(6, "0")}`;

    return tx.booking.create({
      data: {
        bookingRef,
        familyName: data.familyName,
        familyMobile: data.familyMobile,
        residentName: data.residentName,
        residentAge: data.residentAge,
        condition: data.condition,
        mobility: data.mobility,
        arrivalDate: data.arrivalDate,
        attendantName: data.attendantName,
        attendantRelation: data.attendantRelation,
        longTermConfirmed: data.longTermConfirmed,
        consentAccepted: data.consentAccepted,
        months: price.months,
        monthlyRatePaise: price.monthlyRatePaise,
        depositPaise: price.depositPaise,
        amountPaise: price.totalPaise,
        status: "PROVISIONAL",
      },
    });
  });

  // Create the Razorpay order for the exact server-computed amount.
  let order;
  try {
    order = await razorpay().orders.create({
      amount: price.totalPaise, // paise
      currency: "INR",
      receipt: booking.bookingRef,
      notes: { bookingRef: booking.bookingRef, months: String(price.months) },
    });
  } catch (e) {
    console.error("Razorpay order creation failed", e);
    return NextResponse.json(
      { error: "Payment gateway is unavailable. Please try again shortly." },
      { status: 502 },
    );
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { razorpayOrderId: order.id },
  });

  return NextResponse.json({
    bookingRef: booking.bookingRef,
    orderId: order.id,
    amountPaise: price.totalPaise,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
