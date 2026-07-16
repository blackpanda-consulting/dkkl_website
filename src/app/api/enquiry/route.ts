import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enquirySchema } from "@/lib/enquiry-schema";

export const runtime = "nodejs";

// Store a consultation enquiry from the contact form.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }
  const d = parsed.data;

  await prisma.enquiry.create({
    data: {
      name: d.name,
      mobile: d.mobile,
      email: d.email || null,
      preferredStay: d.preferredStay || null,
      message: d.message || null,
    },
  });

  return NextResponse.json({ ok: true });
}
