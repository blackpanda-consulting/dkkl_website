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

// Refundable security deposit. Tiered by length of stay, and calculated from the
// SELECTED room's monthly rate, so it differs across single / double / shared.
//
//     1 to 2 months    flat ₹5,000
//     3 to 6 months    one month's charges
//     7 months plus    two months' charges
//
// Confirmed anchors: 1 month = ₹5,000, 3 and 6 months = one month, 12 months =
// two months. The unnamed lengths (2, 4, 5, 7 to 11) follow the bands above.
// Refundable, settled with the team, never collected on this site.
export const SHORT_STAY_DEPOSIT_PAISE = 500_000; // ₹5,000

export function depositForStay(months: number, monthlyRatePaise: number): number {
  if (months <= 2) return SHORT_STAY_DEPOSIT_PAISE;
  if (months <= 6) return monthlyRatePaise;
  return monthlyRatePaise * 2;
}

// Describes how the deposit was derived, so the breakdown line explains itself.
export function depositLabel(months: number): string {
  if (months <= 2) return "Refundable deposit";
  if (months <= 6) return "Refundable deposit (1 month)";
  return "Refundable deposit (2 months)";
}

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
export function estimatedTotalPaise(
  accommodationPaise: number,
  depositPaise: number,
): number {
  return accommodationPaise + depositPaise;
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
