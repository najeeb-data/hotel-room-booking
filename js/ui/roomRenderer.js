import { formatCurrency } from "../utils/currencyUtils.js";

/**
 * Renders the room list into `container`. `onSelectRoom` is called with a
 * room code when the user clicks an available room's select button.
 *
 * `getAvailability(room)` lets the caller mark a room as unavailable for
 * the currently chosen dates (optional booking-conflict bonus) without
 * this module knowing anything about dates or bookings itself.
 */
export function renderRooms(container, rooms, { selectedRoomCode, getAvailability }, onSelectRoom) {
  container.textContent = "";

  if (rooms.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No rooms match the selected guest count.";
    container.appendChild(empty);
    return;
  }

  rooms.forEach((room) => {
    container.appendChild(buildRoomCard(room, selectedRoomCode, getAvailability, onSelectRoom));
  });
}

function buildRoomCard(room, selectedRoomCode, getAvailability, onSelectRoom) {
  const isSelected = room.code === selectedRoomCode;
  const isAvailable = getAvailability ? getAvailability(room) : true;

  const card = document.createElement("article");
  card.className = "room-card";
  card.classList.toggle("room-card--selected", isSelected);
  card.classList.toggle("room-card--unavailable", !isAvailable);

  const header = document.createElement("div");
  header.className = "room-card__header";

  const type = document.createElement("h3");
  type.className = "room-card__type";
  type.textContent = room.type;

  const code = document.createElement("p");
  code.className = "room-card__code";
  code.textContent = `Room ${room.code}`;

  header.append(type, code);

  const guests = document.createElement("p");
  guests.className = "room-card__guests";
  guests.textContent = `Up to ${room.maxGuests} guest${room.maxGuests > 1 ? "s" : ""}`;

  const priceRow = document.createElement("div");
  priceRow.className = "room-card__price";

  const priceAmount = document.createElement("span");
  priceAmount.className = "room-card__price-amount";
  priceAmount.textContent = formatCurrency(room.pricePerNight);

  const priceLabel = document.createElement("span");
  priceLabel.className = "room-card__price-label";
  priceLabel.textContent = "per night";

  priceRow.append(priceAmount, priceLabel);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "room-card__button";
  button.setAttribute("aria-pressed", String(isSelected));

  if (!isAvailable) {
    button.textContent = "Unavailable for these dates";
    button.disabled = true;
  } else if (isSelected) {
    button.textContent = "Selected";
  } else {
    button.textContent = "Select Room";
  }

  button.addEventListener("click", () => onSelectRoom(room.code));

  card.append(header, guests, priceRow, button);
  return card;
}
