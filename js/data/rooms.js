// Static room inventory for the assessment. No backend/API involved.
export const rooms = [
  { code: "R101", type: "Deluxe Room", pricePerNight: 3500, maxGuests: 2 },
  { code: "R102", type: "Deluxe Room", pricePerNight: 3500, maxGuests: 2 },
  { code: "R201", type: "Executive Suite", pricePerNight: 5800, maxGuests: 3 },
  { code: "R202", type: "Executive Suite", pricePerNight: 5800, maxGuests: 3 },
  { code: "R301", type: "Family Room", pricePerNight: 4200, maxGuests: 4 },
];

export function getRoomByCode(code) {
  return rooms.find((room) => room.code === code) || null;
}
