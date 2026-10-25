// Server-side TMDB client. The API key now lives only here (never shipped to
// the browser bundle) and responses are cached briefly to cut down on calls.

import NodeCache from 'node-cache';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

const BASE = 'https://api.themoviedb.org/3';
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10 min

export const hasTmdb = Boolean(env.tmdbApiKey);

async function tmdb(path, params = {}) {
  if (!hasTmdb) {
    throw ApiError.badRequest(
      'TMDB_API_KEY is not configured on the server yet — using demo data instead.'
    );
  }

  const cacheKey = path + JSON.stringify(params);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = new URL(BASE + path);
  const headers = { accept: 'application/json' };
  // v4 read-access tokens are JWTs; v3 keys are short hex strings.
  if (env.tmdbApiKey.startsWith('eyJ')) headers.Authorization = `Bearer ${env.tmdbApiKey}`;
  else url.searchParams.set('api_key', env.tmdbApiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new ApiError(res.status === 401 ? 502 : 502, `TMDB request failed (${res.status})`);
  }
  const data = await res.json();
  cache.set(cacheKey, data);
  return data;
}

export async function tmdbNowPlaying() {
  const now = await tmdb('/movie/now_playing', { language: 'en-US', region: 'IN', page: 1 });
  let items = now.results || [];
  if (items.length < 10) {
    const pop = await tmdb('/movie/popular', { language: 'en-US', region: 'IN', page: 1 });
    const seen = new Set(items.map((m) => m.id));
    items = [...items, ...(pop.results || []).filter((m) => !seen.has(m.id))];
  }
  return items;
}

export async function tmdbUpcoming() {
  const res = await tmdb('/movie/upcoming', { language: 'en-US', region: 'IN', page: 1 });
  return res.results || [];
}

export async function tmdbMovieDetails(id) {
  return tmdb(`/movie/${id}`, { language: 'en-US', append_to_response: 'credits,videos,release_dates' });
}
