import { xmur3, mulberry32 } from './seats.js';
import { THEATRES } from './movies.js';

const SLOTS = [
  '09:30 AM',
  '10:15 AM',
  '11:30 AM',
  '12:45 PM',
  '02:00 PM',
  '03:15 PM',
  '04:30 PM',
  '05:45 PM',
  '07:00 PM',
  '08:15 PM',
  '09:30 PM',
  '10:45 PM',
];

// Deterministic showtimes per movie id (same movie -> same times every visit).
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

// Fallback colours used while / if a poster image is unavailable.
export function gradientFor(id) {
  const p = PALETTES[xmur3(`grad-${id}`) % PALETTES.length];
  return { colors: [p[0], p[1]], accent: p[2] };
}
