// Format an Indian phone number for display as "+91 XXXX XXX XXX"
// (a space after the country code, and after the 4th and 7th digits of the
// 10-digit local number). The raw value is still used for the tel: link.
export function formatPhone(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  const local = digits.slice(-10);
  if (local.length !== 10) return raw; // unexpected format — show as-is
  const cc = digits.slice(0, digits.length - 10) || "91";
  return `+${cc} ${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}
