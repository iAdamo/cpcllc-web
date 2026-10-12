/** A US number in E.164: +1 and ten digits. The marketplace is US only. */
export const US_PHONE_REGEX = /^\+1\d{10}$/;
export const US_DIAL_CODE = "+1";
/** Digits in a US number after the +1. */
export const US_LOCAL_DIGITS = 10;

/**
 * A typed phone number in E.164. Accepts +1XXXXXXXXXX and 1XXXXXXXXXX with
 * spaces, dashes, dots or brackets; leaves anything else as typed (cleaned),
 * so validation can refuse it.
 */
export function normalizePhoneNumber(value: string): string {
  const cleaned = value.trim().replace(/[\s\-().]/g, "");
  if (!cleaned) return "";

  let normalized = cleaned;
  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  }

  if (normalized.startsWith("+")) {
    normalized = `+${normalized.slice(1).replace(/\+/g, "")}`;
  }

  if (!normalized.startsWith("+") && /^1\d{10}$/.test(normalized)) {
    normalized = `+${normalized}`;
  }

  return normalized;
}

export function isValidUsPhoneNumber(value: string): boolean {
  return US_PHONE_REGEX.test(normalizePhoneNumber(value));
}

/** The ten local digits typed after +1 → "+15551234567". */
export function usPhoneFromDigits(digits: string): string {
  return `${US_DIAL_CODE}${digits.replace(/\D/g, "")}`;
}

/** Local digits as they're typed: "5551234567" → "(555) 123-4567". */
export function formatUsDigits(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, US_LOCAL_DIGITS);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
