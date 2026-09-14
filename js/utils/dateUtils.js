// All date logic lives here so it can be unit tested in isolation from the DOM.
// Dates are normalized to UTC midnight before any comparison or subtraction.
// This avoids off-by-one errors caused by local timezone offsets or DST
// transitions, which is the most common source of bugs in "days between
// two dates" calculations.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Converts a Date or an ISO date string ("YYYY-MM-DD") into a Date object
 * pinned to UTC midnight, stripping any time-of-day or local timezone noise.
 */
export function normalizeDate(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(Date.UTC(year, month - 1, day));
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  return null;
}

/** Returns today's date normalized to UTC midnight. */
export function getToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/** Returns today's date as an ISO string, for use as a native input's `min`. */
export function getTodayIso() {
  return isoFromDate(getToday());
}

export function isoFromDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** True when `date` falls strictly before today. */
export function isPastDate(date) {
  const normalized = normalizeDate(date);
  if (!normalized) return false;
  return normalized.getTime() < getToday().getTime();
}

/**
 * A date range is valid when both dates are present, well-formed, and
 * checkout falls strictly after check-in (same-day stays are not allowed).
 */
export function isValidDateRange(checkIn, checkOut) {
  const start = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);
  if (!start || !end) return false;
  return end.getTime() > start.getTime();
}

/**
 * Returns the number of nights between two dates, or null when the range
 * is not valid. Callers should check isValidDateRange first, or treat a
 * null return as "cannot be calculated".
 */
export function calculateNights(checkIn, checkOut) {
  if (!isValidDateRange(checkIn, checkOut)) return null;
  const start = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

/**
 * Two date ranges overlap unless one ends on or before the other begins.
 * Checkout is treated as the moment the room becomes free again, so a
 * booking ending the same day another begins does NOT overlap.
 */
export function rangesOverlap(startA, endA, startB, endB) {
  const a1 = normalizeDate(startA);
  const a2 = normalizeDate(endA);
  const b1 = normalizeDate(startB);
  const b2 = normalizeDate(endB);
  if (!a1 || !a2 || !b1 || !b2) return false;
  return a1.getTime() < b2.getTime() && b1.getTime() < a2.getTime();
}
