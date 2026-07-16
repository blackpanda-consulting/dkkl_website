import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { getSettings, updateRates, SETTINGS_TAG } from "@/lib/settings";

export const runtime = "nodejs";

// Public read: the calculator needs the current rates.
export async function GET() {
  const s = await getSettings();
  return NextResponse.json({
    singleRatePaise: s.singleRatePaise,
    doubleRatePaise: s.doubleRatePaise,
    sharedRatePaise: s.sharedRatePaise,
    updatedAt: s.updatedAt,
  });
}

// Amounts are entered in whole rupees in the admin UI; stored as paise.
const rupees = z.coerce.number().int().min(0).max(10_000_000);
const rateSchema = z.object({
  singleRateRupees: rupees,
  doubleRateRupees: rupees,
  sharedRateRupees: rupees,
});

// Protected write (spec §7/§10): edit rates without a code deploy.
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

  const s = await updateRates({
    singleRatePaise: parsed.data.singleRateRupees * 100,
    doubleRatePaise: parsed.data.doubleRateRupees * 100,
    sharedRatePaise: parsed.data.sharedRateRupees * 100,
    updatedBy: "admin",
  });

  // Refresh the cached public pricing and the home page. (The payable amount is
  // always recomputed server-side at order time, so display staleness is safe.)
  revalidateTag(SETTINGS_TAG, "max");
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    singleRatePaise: s.singleRatePaise,
    doubleRatePaise: s.doubleRatePaise,
    sharedRatePaise: s.sharedRatePaise,
  });
}
