import { isPastDate, isValidDateRange } from "./dateUtils.js";

/** @typedef {{ valid: boolean, message: string }} ValidationResult */

/** @returns {ValidationResult} */
export function validateCheckIn(checkIn) {
  if (!checkIn) {
    return { valid: false, message: "Please select a check-in date." };
  }
  if (isPastDate(checkIn)) {
    return { valid: false, message: "Check-in date cannot be in the past." };
  }
  return { valid: true, message: "" };
}

/** @returns {ValidationResult} */
export function validateCheckOut(checkIn, checkOut) {
  if (!checkOut) {
    return { valid: false, message: "Please select a check-out date." };
  }
  if (!checkIn) {
    return { valid: false, message: "Please select both check-in and check-out dates." };
  }
  if (!isValidDateRange(checkIn, checkOut)) {
    return { valid: false, message: "Check-out date must be after check-in date." };
  }
  return { valid: true, message: "" };
}

/** @returns {ValidationResult} */
export function validateRoomSelection(selectedRoomCode) {
  if (!selectedRoomCode) {
    return { valid: false, message: "Please select a room." };
  }
  return { valid: true, message: "" };
}

/**
 * Runs every check needed to produce a booking and returns the first
 * failure found, or a valid result when the booking can be calculated.
 * Checks are ordered so the most fundamental problem is reported first.
 * @returns {ValidationResult}
 */
export function validateBooking({ checkIn, checkOut, selectedRoomCode }) {
  if (!checkIn && !checkOut) {
    return { valid: false, message: "Please select both check-in and check-out dates." };
  }

  const checkInResult = validateCheckIn(checkIn);
  if (!checkInResult.valid) return checkInResult;

  const checkOutResult = validateCheckOut(checkIn, checkOut);
  if (!checkOutResult.valid) return checkOutResult;

  const roomResult = validateRoomSelection(selectedRoomCode);
  if (!roomResult.valid) return roomResult;

  return { valid: true, message: "" };
}
