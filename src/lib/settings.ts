import { prisma } from "./db";

// The Setting row is a singleton (id = 1). getSettings() ensures it exists so
// the app works immediately after `prisma db push` without a separate seed step.
export async function getSettings() {
  return prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

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
