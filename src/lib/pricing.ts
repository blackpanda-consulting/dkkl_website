// Shared pricing math. Runs on both client (display) and server (authoritative).
// All amounts are integer paise to avoid floating-point drift.
//
//   Accommodation = Selected Room Monthly Rate × Months
//   Estimated Total = Accommodation + Refundable Deposit
//
// No GST is added. Nothing here is charged online: the site shows an estimate
// and collects only a flat booking fee via a Razorpay link. The deposit is
// settled with the team.

export const MIN_MONTHS = 1;
export const MAX_MONTHS = 24; // beyond this, the UI offers a callback instead

// One-time refundable security deposit, not a monthly charge. The deposit is
// refundable and is settled with the team, never collected on this site.
export const DEPOSIT_PAISE = 5_000_000; // ₹50,000

export type RoomType = "SINGLE" | "DOUBLE" | "SHARED";

export type Rates = {
  singleRatePaise: number;
  doubleRatePaise: number;
  sharedRatePaise: number;
};

export type PriceBreakdown = {
  months: number;
  monthlyRatePaise: number;
  /** Accommodation only: rate × months. Excludes the deposit. */
  totalPaise: number;
};

// Accommodation only. Deliberately excludes the deposit: /api/orders charges
// price.totalPaise, so folding the deposit in here would silently change what
// that flow bills if it is ever switched back on. Callers that want the
// family's full outlay use estimatedTotalPaise below.
export function computePrice(months: number, monthlyRatePaise: number): PriceBreakdown {
  if (!Number.isInteger(months) || months < MIN_MONTHS || months > MAX_MONTHS) {
    throw new Error(`months must be an integer between ${MIN_MONTHS} and ${MAX_MONTHS}`);
  }
  return {
    months,
    monthlyRatePaise,
    totalPaise: monthlyRatePaise * months,
  };
}

/** What the family should budget for: accommodation plus the refundable deposit. */
export function estimatedTotalPaise(accommodationPaise: number): number {
  return accommodationPaise + DEPOSIT_PAISE;
}

// Pick the monthly rate for an occupancy type from the configured settings.
export function rateForRoom(roomType: RoomType, rates: Rates): number {
  if (roomType === "SINGLE") return rates.singleRatePaise;
  if (roomType === "SHARED") return rates.sharedRatePaise;
  return rates.doubleRatePaise;
}

// Format paise as Indian Rupees, e.g. 9000000 -> "₹90,000".
export function formatInr(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}
