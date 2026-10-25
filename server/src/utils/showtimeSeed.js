// Mirrors the frontend's deterministic "already booked" demo seats
// (src/data/seats.js) so seat maps look identical server- and client-side,
// and so a user can never book a seat the UI shows as pre-taken.

import { ROWS, COLS } from './seatPricing.js';

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

// ---- demo showtimes / colour gradients (mirrors frontend src/data/showtimes.js) ----

export const THEATRES = [
  { id: 't1', name: 'CineBook Grand', area: 'City Centre Mall', features: ['Dolby Atmos', 'Recliner seats'] },
  { id: 't2', name: 'Starplex Multiplex', area: 'Riverside Road', features: ['4K Laser', 'Food court'] },
  { id: 't3', name: 'Regal Talkies', area: 'Old Town', features: ['Classic hall', 'Budget friendly'] },
];

const SLOTS = [
  '09:30 AM', '10:15 AM', '11:30 AM', '12:45 PM', '02:00 PM', '03:15 PM',
  '04:30 PM', '05:45 PM', '07:00 PM', '08:15 PM', '09:30 PM', '10:45 PM',
];

export function generateShowtimes(id) {
  const rand = mulberry32(xmur3(`show-${id}`));
  const out = {};
  THEATRES.forEach((t) => {
    const count = 3 + Math.floor(rand() * 2);
    const picked = new Set();
    while (picked.size < count) picked.add(Math.floor(rand() * SLOTS.length));
    out[t.id] = [...picked].sort((a, b) => a - b).map((i) => SLOTS[i]);
  });
  return out;
}

const PALETTES = [
  ['#0f2027', '#2c5364', '#00e5ff'],
  ['#232526', '#414345', '#ffd166'],
  ['#42275a', '#734b6d', '#ff5e62'],
  ['#1a2a6c', '#b21f1f', '#fdbb2d'],
  ['#141e30', '#35577d', '#c9d6ff'],
  ['#200122', '#6f0000', '#ff4d4d'],
  ['#134e5e', '#71b280', '#d4fc79'],
  ['#3a1c71', '#d76d77', '#ffaf7b'],
];

export function gradientFor(id) {
  const p = PALETTES[xmur3(`grad-${id}`) % PALETTES.length];
  return { colors: [p[0], p[1]], accent: p[2] };
}
