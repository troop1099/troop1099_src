import { format } from 'date-fns';

/**
 * Parse a date value from Google Sheets, which may come as:
 * - ISO string (YYYY-MM-DD)
 * - M/D/YYYY or MM/DD/YYYY string
 * - Excel serial number (number or numeric string)
 */
export function parseDate(value) {
  if (value === null || value === undefined || value === '') return null;
  // Excel serial number (number type — from Sheets API with UNFORMATTED_VALUE)
  if (typeof value === 'number') {
    if (value > 1) return new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    return null;
  }
  const str = String(value).trim();
  // Excel serial number as string (e.g. "45361")
  if (/^\d+$/.test(str)) {
    const serial = Number(str);
    if (serial > 1) return new Date(Date.UTC(1899, 11, 30) + serial * 86400000);
  }
  // ISO format (YYYY-MM-DD)
  let d = new Date(str + 'T12:00:00');
  if (!isNaN(d)) return d;
  // Try as-is (handles M/D/YYYY, MM/DD/YYYY, etc.)
  d = new Date(str);
  if (!isNaN(d)) return d;
  return null;
}

/**
 * Safely format a date with a date-fns format string, falling back to the raw value.
 */
export function safeFormatDate(value, fmt) {
  const d = parseDate(value);
  if (!d) return value || '';
  try {
    return format(d, fmt);
  } catch {
    return value || '';
  }
}