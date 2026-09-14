import { formatCurrency } from "../utils/currencyUtils.js";

const EMPTY_MESSAGE = "Select your dates and a room to see your booking summary.";

function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Shows the "nothing to display yet" state with a guiding message. */
export function renderEmptySummary(container, message = EMPTY_MESSAGE) {
  container.textContent = "";
  const empty = document.createElement("p");
  empty.className = "empty-state";
  empty.textContent = message;
  container.appendChild(empty);
}

/** Renders a completed booking calculation. */
export function renderSummary(container, booking) {
  container.textContent = "";

  const rows = [
    ["Room", booking.room.code],
    ["Room Type", booking.room.type],
    ["Check-in", formatDisplayDate(booking.checkIn)],
    ["Check-out", formatDisplayDate(booking.checkOut)],
    ["Nights", String(booking.nights)],
    ["Price per night", formatCurrency(booking.pricePerNight)],
  ];

  const list = document.createElement("dl");
  list.className = "summary-list";

  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "summary-list__row";

    const dt = document.createElement("dt");
    dt.textContent = label;

    const dd = document.createElement("dd");
    dd.textContent = value;

    row.append(dt, dd);
    list.appendChild(row);
  });

  const totalRow = document.createElement("div");
  totalRow.className = "summary-total";

  const totalLabel = document.createElement("span");
  totalLabel.textContent = "Total";

  const totalValue = document.createElement("span");
  totalValue.className = "summary-total__amount";
  totalValue.textContent = formatCurrency(booking.total);

  totalRow.append(totalLabel, totalValue);

  container.append(list, totalRow);
}
