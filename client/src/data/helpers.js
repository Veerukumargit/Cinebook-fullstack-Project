export const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function getNextDays(n = 5) {
  const base = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    return {
      iso: toISO(d),
      day: i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
    };
  });
}

export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function showDateTime(iso, time) {
  const [t, ap] = time.split(' ');
  let [h, min] = t.split(':').map(Number);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, h, min);
}

export const isPast = (iso, time) => showDateTime(iso, time) < new Date();

export const currency = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const makeBookingId = () =>
  'CB' + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).toUpperCase().slice(2, 5);

// Small copy of a movie stored inside bookings / watchlists so they keep working offline.
export const movieSnapshot = (m) => ({
  id: m.id,
  title: m.title,
  poster: m.poster || null,
  backdrop: m.backdrop || null,
  certificate: m.certificate,
  duration: m.duration || '',
  genres: m.genres || [],
  languages: m.languages || [],
  rating: m.rating,
  colors: m.colors,
  accent: m.accent,
  emoji: m.emoji,
  dark: m.dark,
  source: m.source,
  releaseDate: m.releaseDate || '',
});

// A movie is "upcoming" when its release date is after today (no showtimes / booking yet).
export const isUpcoming = (m) => Boolean(m?.releaseDate) && m.releaseDate > toISO(new Date());

export function formatShortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatLongDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
