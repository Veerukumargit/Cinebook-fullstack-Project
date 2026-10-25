import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { hasTmdb, tmdbNowPlaying, tmdbUpcoming, tmdbMovieDetails } from '../utils/tmdb.js';
import { normalizeListItem, normalizeDetails } from '../utils/normalizeMovie.js';

export const config = asyncHandler(async (req, res) => {
  res.json({ hasTmdb });
});

export const nowPlaying = asyncHandler(async (req, res) => {
  const raw = await tmdbNowPlaying();
  const list = raw
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 20)
    .map(normalizeListItem);
  res.json(list);
});

export const upcoming = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const raw = await tmdbUpcoming();
  const list = raw
    .filter((m) => m.poster_path && m.release_date && m.release_date > today)
    .sort((a, b) => a.release_date.localeCompare(b.release_date))
    .slice(0, 12)
    .map(normalizeListItem);
  res.json(list);
});

export const details = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!/^\d+$/.test(id)) throw ApiError.badRequest('Invalid movie id');
  const raw = await tmdbMovieDetails(id);
  res.json(normalizeDetails(raw));
});
