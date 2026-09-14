import { calculateNights, rangesOverlap } from "../utils/dateUtils.js";
import { getRoomByCode } from "../data/rooms.js";
import { existingBookings } from "../data/bookings.js";

export function getSelectedRoom(roomCode) {
  return getRoomByCode(roomCode);
}

/** total = numberOfNights x pricePerNight */
export function calculateTotal(nights, pricePerNight) {
  if (typeof nights !== "number" || typeof pricePerNight !== "number") return null;
  if (nights <= 0) return null;
  return nights * pricePerNight;
}

/**
 * Checks a room against the hardcoded existing bookings for the requested
 * date range. Checkout is treated as the moment the room becomes free, so
 * a request starting the day another booking ends is available.
 */
export function isRoomAvailable(roomCode, checkIn, checkOut) {
  return !existingBookings.some(
    (booking) =>
      booking.roomCode === roomCode &&
      rangesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)
  );
}

/**
 * Builds the full booking calculation (nights, price, total) for a room
 * and date range that have already passed validation. Returns null if the
 * inputs cannot produce a valid calculation, so callers never display a
 * misleading total.
 */
export function calculateBooking({ checkIn, checkOut, selectedRoomCode }) {
  const room = getSelectedRoom(selectedRoomCode);
  const nights = calculateNights(checkIn, checkOut);

  if (!room || nights === null) return null;

  const total = calculateTotal(nights, room.pricePerNight);
  if (total === null) return null;

  return {
    room,
    checkIn,
    checkOut,
    nights,
    pricePerNight: room.pricePerNight,
    total,
  };
}
