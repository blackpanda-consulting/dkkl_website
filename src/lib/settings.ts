import { unstable_cache } from "next/cache";
import { prisma } from "./db";

// Fallback pricing if the singleton row doesn't exist yet.
const DEFAULT_MONTHLY_RATE_PAISE = 3000000; // ₹30,000
const DEFAULT_DEPOSIT_PAISE = 500000; // ₹5,000

export const SETTINGS_TAG = "settings";

// The Setting row is a singleton (id = 1). getSettings() ensures it exists so
// the app works immediately after `prisma db push` without a separate seed step.
// Used by the admin panel (always fresh).
export async function getSettings() {
  return prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

// Cached, read-only pricing for the public site. Tagged so it can be
// invalidated on-demand when the admin changes the rate — this lets the home
// page be statically cached (fast, CDN-served) yet always accurate.
export const getPublicSettings = unstable_cache(
  async () => {
    const s = await prisma.setting.findUnique({ where: { id: 1 } });
    return {
      monthlyRatePaise: s?.monthlyRatePaise ?? DEFAULT_MONTHLY_RATE_PAISE,
      depositPaise: s?.depositPaise ?? DEFAULT_DEPOSIT_PAISE,
    };
  },
  ["public-settings"],
  { tags: [SETTINGS_TAG], revalidate: 3600 },
);

export async function updateRate(params: {
  monthlyRatePaise: number;
  depositPaise: number;
  updatedBy?: string;
}) {
  return prisma.setting.upsert({
    where: { id: 1 },
    update: {
      monthlyRatePaise: params.monthlyRatePaise,
      depositPaise: params.depositPaise,
      updatedBy: params.updatedBy ?? null,
    },
    create: {
      id: 1,
      monthlyRatePaise: params.monthlyRatePaise,
      depositPaise: params.depositPaise,
      updatedBy: params.updatedBy ?? null,
    },
  });
}
