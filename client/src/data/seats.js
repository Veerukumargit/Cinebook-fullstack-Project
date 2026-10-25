export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const COLS = 12;
export const AISLE_AFTER = 6;
export const MAX_SEATS = 8;
export const CONVENIENCE_FEE = 30; // per ticket, in INR

// Row A is nearest the screen.
export const TIERS = [
  { name: 'Silver', rows: ['A', 'B', 'C'], price: 180 },
  { name: 'Gold', rows: ['D', 'E', 'F', 'G'], price: 250 },
  { name: 'Premium', rows: ['H', 'I', 'J'], price: 350 },
];

export const tierOfRow = (row) => TIERS.find((t) => t.rows.includes(row));
export const priceOfSeat = (seatId) => tierOfRow(seatId[0]).price;

export function calcTotals(seats) {
  const subtotal = seats.reduce((sum, s) => sum + priceOfSeat(s), 0);
  const fee = seats.length * CONVENIENCE_FEE;
  return { subtotal, fee, total: subtotal + fee };
}

// ---- deterministic "already booked" seats per show ----
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededTakenSeats(showKey) {
  const rand = mulberry32(xmur3(showKey));
  const taken = [];
  ROWS.forEach((row) => {
    for (let c = 1; c <= COLS; c++) {
      if (rand() < 0.27) taken.push(`${row}${c}`);
    }
  });
  return taken;
}

export { xmur3, mulberry32 };
