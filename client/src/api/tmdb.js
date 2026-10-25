/**
 * Movie data now comes from the server's /api/movies/* proxy instead of
 * calling TMDB directly from the browser, so the TMDB key never ships in the
 * frontend bundle (see server/.env — TMDB_API_KEY).
 *
 * Function signatures are unchanged, so MoviesContext doesn't need to know
 * anything moved. `hasTmdb` is kept `true` so the app always tries the
 * server first and falls back to the built-in demo catalogue on failure —
 * exactly like the old "no key configured" behaviour.
 */
import { api } from './client.js';

export const hasTmdb = true;

export async function fetchNowPlaying() {
  return api.get('/api/movies/now-playing');
}

export async function fetchUpcoming() {
  return api.get('/api/movies/upcoming');
}

export async function fetchMovieDetails(id) {
  return api.get(`/api/movies/${id}`);
}
