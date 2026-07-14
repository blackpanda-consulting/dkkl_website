import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { getSettings, updateRate } from "@/lib/settings";

export const runtime = "nodejs";

// Public read: the calculator needs the current rate.
export async function GET() {
  const s = await getSettings();
  return NextResponse.json({
    monthlyRatePaise: s.monthlyRatePaise,
    depositPaise: s.depositPaise,
    updatedAt: s.updatedAt,
  });
}

// Amounts are entered in whole rupees in the admin UI; store as paise.
const rateSchema = z.object({
  monthlyRateRupees: z.coerce.number().int().min(0).max(10_000_000),
  depositRupees: z.coerce.number().int().min(0).max(10_000_000),
});

// Protected write (spec §7/§10): edit rate without a code deploy.
export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = rateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid amounts" }, { status: 400 });
  }

  const s = await updateRate({
    monthlyRatePaise: parsed.data.monthlyRateRupees * 100,
    depositPaise: parsed.data.depositRupees * 100,
    updatedBy: "admin",
  });

  return NextResponse.json({
    ok: true,
    monthlyRatePaise: s.monthlyRatePaise,
    depositPaise: s.depositPaise,
  });
}
