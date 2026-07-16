import { unstable_cache } from "next/cache";
import { prisma } from "./db";

// Fallback pricing if the singleton row doesn't exist yet.
const DEFAULT_SINGLE_RATE_PAISE = 2500000; // ₹25,000
const DEFAULT_DOUBLE_RATE_PAISE = 3000000; // ₹30,000
const DEFAULT_SHARED_RATE_PAISE = 1800000; // ₹18,000

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
// invalidated on-demand when the admin changes rates — this lets the home page
// be statically cached (fast, CDN-served) yet always accurate.
export const getPublicSettings = unstable_cache(
  async () => {
    const s = await prisma.setting.findUnique({ where: { id: 1 } });
    return {
      singleRatePaise: s?.singleRatePaise ?? DEFAULT_SINGLE_RATE_PAISE,
      doubleRatePaise: s?.doubleRatePaise ?? DEFAULT_DOUBLE_RATE_PAISE,
      sharedRatePaise: s?.sharedRatePaise ?? DEFAULT_SHARED_RATE_PAISE,
    };
  },
  ["public-settings"],
  { tags: [SETTINGS_TAG], revalidate: 3600 },
);

export async function updateRates(params: {
  singleRatePaise: number;
  doubleRatePaise: number;
  sharedRatePaise: number;
  updatedBy?: string;
}) {
  const data = {
    singleRatePaise: params.singleRatePaise,
    doubleRatePaise: params.doubleRatePaise,
    sharedRatePaise: params.sharedRatePaise,
    updatedBy: params.updatedBy ?? null,
  };
  return prisma.setting.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}
