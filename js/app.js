import { rooms } from "./data/rooms.js";
import { getTodayIso, isoFromDate, normalizeDate } from "./utils/dateUtils.js";
import { validateBooking } from "./utils/validationUtils.js";
import { calculateBooking, isRoomAvailable } from "./services/bookingService.js";
import { renderRooms } from "./ui/roomRenderer.js";
import { renderEmptySummary, renderSummary } from "./ui/bookingSummary.js";
import { showError, clearError } from "./ui/errorMessage.js";

// Messages that mean "nothing entered yet" rather than "something is wrong".
// These are shown as gentle guidance in the summary panel instead of the
// alarming error banner, so the UI doesn't scold a user who simply hasn't
// finished making a selection.
const INCOMPLETE_MESSAGES = new Set([
  "Please select both check-in and check-out dates.",
  "Please select a check-in date.",
  "Please select a check-out date.",
  "Please select a room.",
]);

const state = {
  checkIn: "",
  checkOut: "",
  selectedRoomCode: "",
  minGuests: 1,
};

const elements = {
  checkInInput: document.getElementById("check-in"),
  checkOutInput: document.getElementById("check-out"),
  guestFilter: document.getElementById("guest-filter"),
  roomList: document.getElementById("room-list"),
  summary: document.getElementById("booking-summary"),
  error: document.getElementById("error-message"),
};

function getVisibleRooms() {
  if (!state.minGuests || state.minGuests <= 1) return rooms;
  return rooms.filter((room) => room.maxGuests >= state.minGuests);
}

function getRoomAvailability(room) {
  if (!state.checkIn || !state.checkOut) return true;
  return isRoomAvailable(room.code, state.checkIn, state.checkOut);
}

function handleRoomSelect(roomCode) {
  state.selectedRoomCode = state.selectedRoomCode === roomCode ? "" : roomCode;
  update();
}

function updateCheckOutMinimum() {
  if (!state.checkIn) {
    elements.checkOutInput.min = getTodayIso();
    return;
  }
  const checkIn = normalizeDate(state.checkIn);
  const minCheckOut = new Date(checkIn);
  minCheckOut.setUTCDate(minCheckOut.getUTCDate() + 1);
  elements.checkOutInput.min = isoFromDate(minCheckOut);
}

function update() {
  updateCheckOutMinimum();

  const visibleRooms = getVisibleRooms();
  if (state.selectedRoomCode && !visibleRooms.some((room) => room.code === state.selectedRoomCode)) {
    state.selectedRoomCode = "";
  }

  renderRooms(
    elements.roomList,
    visibleRooms,
    { selectedRoomCode: state.selectedRoomCode, getAvailability: getRoomAvailability },
    handleRoomSelect
  );

  const result = validateBooking(state);
  const isUntouched = !state.checkIn && !state.checkOut && !state.selectedRoomCode;

  if (!result.valid) {
    if (isUntouched) {
      clearError(elements.error);
      renderEmptySummary(elements.summary);
    } else if (INCOMPLETE_MESSAGES.has(result.message)) {
      clearError(elements.error);
      renderEmptySummary(elements.summary, result.message);
    } else {
      showError(elements.error, result.message);
      renderEmptySummary(elements.summary);
    }
    return;
  }

  if (!isRoomAvailable(state.selectedRoomCode, state.checkIn, state.checkOut)) {
    showError(elements.error, "Selected room is not available for these dates.");
    renderEmptySummary(elements.summary);
    return;
  }

  clearError(elements.error);
  const booking = calculateBooking(state);
  renderSummary(elements.summary, booking);
}

function init() {
  elements.checkInInput.min = getTodayIso();
  elements.checkOutInput.min = getTodayIso();

  elements.checkInInput.addEventListener("change", (event) => {
    state.checkIn = event.target.value;
    update();
  });

  elements.checkOutInput.addEventListener("change", (event) => {
    state.checkOut = event.target.value;
    update();
  });

  elements.guestFilter.addEventListener("change", (event) => {
    state.minGuests = Number(event.target.value);
    update();
  });

  update();
}

init();
