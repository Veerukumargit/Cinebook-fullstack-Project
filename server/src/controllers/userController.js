import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { PHONE_RE, passwordIssue } from '../utils/validators.js';

const SALT_ROUNDS = 12;

export const updateProfile = asyncHandler(async (req, res) => {
  const name = (req.body?.name || '').trim();
  const phone = req.body?.phone || '';
  if (name.length < 2) throw ApiError.badRequest('Enter your full name');
  if (!PHONE_RE.test(phone)) throw ApiError.badRequest('Enter a valid 10-digit mobile number');

  req.user.name = name;
  req.user.phone = phone;
  await req.user.save();
  res.json({ user: req.user.toPublicJSON() });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { current, next } = req.body || {};
  const user = await User.findById(req.user._id).select('+passwordHash');
  const ok = current ? await bcrypt.compare(current, user.passwordHash) : false;
  if (!ok) throw ApiError.badRequest('Current password is incorrect');

  const issue = passwordIssue(next);
  if (issue) throw ApiError.badRequest(issue);

  user.passwordHash = await bcrypt.hash(next, SALT_ROUNDS);
  await user.save();
  res.status(204).end();
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const movie = req.body?.movie;
  if (!movie?.id) throw ApiError.badRequest('A movie is required');

  const user = req.user;
  const id = String(movie.id);
  const has = user.favorites.some((f) => f.id === id);
  if (has) {
    user.favorites = user.favorites.filter((f) => f.id !== id);
  } else {
    user.favorites.unshift({ ...movie, id });
  }
  await user.save();
  res.json({ user: user.toPublicJSON() });
});
