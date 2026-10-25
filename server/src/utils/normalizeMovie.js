// Mirrors the frontend's old src/api/normalize.js — TMDB's raw shape in,
// the app's movie shape out. Kept on the server now so the API key and the
// TMDB response shape never have to reach the browser.

import { generateShowtimes, gradientFor } from './showtimeSeed.js';

export const IMG = 'https://image.tmdb.org/t/p';

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

const LANG_MAP = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', ml: 'Malayalam', kn: 'Kannada',
  bn: 'Bengali', mr: 'Marathi', pa: 'Punjabi', ko: 'Korean', ja: 'Japanese', fr: 'French',
  es: 'Spanish', de: 'German', zh: 'Chinese', th: 'Thai', it: 'Italian',
};

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const cleanGenre = (n) => (n === 'Science Fiction' ? 'Sci-Fi' : n);

function base(m) {
  const id = String(m.id);
  const { colors, accent } = gradientFor(id);
  return {
    id,
    source: 'tmdb',
    title: m.title || m.original_title || 'Untitled',
    tagline: m.tagline || '',
    rating: Math.round((m.vote_average || 0) * 10) / 10,
    votes: compact.format(m.vote_count || 0),
    releaseDate: m.release_date || '',
    year: (m.release_date || '').slice(0, 4),
    synopsis: m.overview || 'Synopsis not available yet.',
    poster: m.poster_path ? `${IMG}/w500${m.poster_path}` : null,
    backdrop: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : null,
    colors,
    accent,
    emoji: '🎬',
    showtimes: generateShowtimes(id),
  };
}

export function normalizeListItem(m) {
  const lang = LANG_MAP[m.original_language] || (m.original_language || 'en').toUpperCase();
  return {
    ...base(m),
    genres: (m.genre_ids || []).map((g) => GENRE_MAP[g]).filter(Boolean).slice(0, 3),
    languages: [lang],
    duration: '',
    certificate: m.adult ? 'A' : 'UA',
    director: '',
    cast: [],
    trailerKey: null,
  };
}

function pickCertificate(d) {
  const results = d.release_dates?.results || [];
  const region = results.find((r) => r.iso_3166_1 === 'IN') || results.find((r) => r.iso_3166_1 === 'US');
  const cert = region?.release_dates?.find((x) => x.certification)?.certification;
  return cert || (d.adult ? 'A' : 'UA');
}

export function normalizeDetails(d) {
  const runtime = d.runtime || 0;
  const langs = (d.spoken_languages || []).map((l) => l.english_name).filter(Boolean).slice(0, 3);
  const trailer =
    (d.videos?.results || []).find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    (d.videos?.results || []).find((v) => v.site === 'YouTube');
  return {
    ...base(d),
    genres: (d.genres || []).map((g) => cleanGenre(g.name)).slice(0, 4),
    languages: langs.length ? langs : [LANG_MAP[d.original_language] || 'English'],
    duration: runtime ? `${Math.floor(runtime / 60)}h ${String(runtime % 60).padStart(2, '0')}m` : '',
    certificate: pickCertificate(d),
    director: (d.credits?.crew || []).find((c) => c.job === 'Director')?.name || '',
    cast: (d.credits?.cast || []).slice(0, 6).map((c) => c.name),
    trailerKey: trailer?.key || null,
    detailed: true,
  };
}
