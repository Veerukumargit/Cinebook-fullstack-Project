// Mirrors the frontend's src/data/seats.js exactly, so prices quoted to the
// browser and prices charged by the server always agree. If you change seat
// tiers/pricing on the frontend, update this file too.

export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const COLS = 12;
export const MAX_SEATS = 8;
export const CONVENIENCE_FEE = 30; // per ticket, in INR

export const TIERS = [
  { name: 'Silver', rows: ['A', 'B', 'C'], price: 180 },
  { name: 'Gold', rows: ['D', 'E', 'F', 'G'], price: 250 },
  { name: 'Premium', rows: ['H', 'I', 'J'], price: 350 },
];

const SEAT_RE = /^([A-J])(\d{1,2})$/;

export function isValidSeatId(seatId) {
  const m = SEAT_RE.exec(seatId);
  if (!m) return false;
  const [, row, col] = m;
  return ROWS.includes(row) && Number(col) >= 1 && Number(col) <= COLS;
}

export function tierOfRow(row) {
  return TIERS.find((t) => t.rows.includes(row));
}

export function priceOfSeat(seatId) {
  return tierOfRow(seatId[0])?.price ?? 0;
}

export function calcTotals(seats) {
  const subtotal = seats.reduce((sum, s) => sum + priceOfSeat(s), 0);
  const fee = seats.length * CONVENIENCE_FEE;
  return { subtotal, fee, total: subtotal + fee };
}
