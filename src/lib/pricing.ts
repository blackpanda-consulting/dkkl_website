// Shared pricing math (spec §7). Runs on both client (display) and server
// (authoritative). All amounts are integer paise to avoid floating-point drift.
//
//   Total Payable = (Monthly Accommodation Rate × Months) + Refundable Deposit
//
// The deposit is a ONE-TIME line item and must never be multiplied by months.

export const MIN_MONTHS = 1;
export const MAX_MONTHS = 24; // beyond this, the UI offers a callback instead

export type PriceBreakdown = {
  months: number;
  monthlyRatePaise: number;
  depositPaise: number;
  accommodationPaise: number;
  totalPaise: number;
};

export function computePrice(
  months: number,
  monthlyRatePaise: number,
  depositPaise: number,
): PriceBreakdown {
  if (!Number.isInteger(months) || months < MIN_MONTHS || months > MAX_MONTHS) {
    throw new Error(`months must be an integer between ${MIN_MONTHS} and ${MAX_MONTHS}`);
  }
  const accommodationPaise = monthlyRatePaise * months;
  return {
    months,
    monthlyRatePaise,
    depositPaise,
    accommodationPaise,
    totalPaise: accommodationPaise + depositPaise, // deposit added once
  };
}

// Format paise as Indian Rupees, e.g. 9500000 -> "₹95,000".
export function formatInr(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}
