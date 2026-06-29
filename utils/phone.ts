export const US_NG_PHONE_REGEX = /^\+(1\d{10}|234\d{10})$/;

export function normalizePhoneNumber(value: string): string {
  const cleaned = value.trim().replace(/[\s\-().]/g, '');
  if (!cleaned) return '';

  let normalized = cleaned;
  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`;
  }

  if (normalized.startsWith('+')) {
    normalized = `+${normalized.slice(1).replace(/\+/g, '')}`;
  }

  if (!normalized.startsWith('+')) {
    if (/^1\d{10}$/.test(normalized) || /^234\d{10}$/.test(normalized)) {
      normalized = `+${normalized}`;
    }
  }

  return normalized;
}

export function isValidUsOrNgPhoneNumber(value: string): boolean {
  return US_NG_PHONE_REGEX.test(normalizePhoneNumber(value));
}
