// Shared pricing math. Runs on both client (display) and server (authoritative).
// All amounts are integer paise to avoid floating-point drift.
//
//   Total Payable = Selected Room Monthly Rate × Months
//
// No GST is added in the online total and there is no deposit (per current
// business rules).

export const MIN_MONTHS = 1;
export const MAX_MONTHS = 24; // beyond this, the UI offers a callback instead

export type RoomType = "SINGLE" | "DOUBLE" | "SHARED";

export type Rates = {
  singleRatePaise: number;
  doubleRatePaise: number;
  sharedRatePaise: number;
};

export type PriceBreakdown = {
  months: number;
  monthlyRatePaise: number;
  totalPaise: number;
};

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
