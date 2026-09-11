/**
 * Utility functions for SmritiCare
 */

/**
 * Masks a phone number to privacy format +91 94****** or +91 98******
 * Examples:
 *   "+91 94350 12345" -> "+91 94******"
 *   "+91 98640 67890" -> "+91 98******"
 *   "9435012345" -> "+91 94******"
 *   "108" -> "108 (Emergency Toll-Free)"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '+91 94******';
  const clean = phone.trim();

  // Short emergency numbers like 108 or 112
  if (clean === '108' || clean === '112' || clean === '102') {
    return clean;
  }

  // Extract digits
  const digits = clean.replace(/\D/g, '');

  if (digits.length >= 10) {
    // Last 10 digits
    const last10 = digits.slice(-10);
    const prefix2 = last10.slice(0, 2);
    return `+91 ${prefix2}******`;
  }

  // Fallback pattern if already formatted or shorter
  if (clean.startsWith('+91')) {
    const parts = clean.split(' ');
    if (parts.length >= 2 && parts[1].length >= 2) {
      return `+91 ${parts[1].slice(0, 2)}******`;
    }
    return '+91 94******';
  }

  return '+91 94******';
}
