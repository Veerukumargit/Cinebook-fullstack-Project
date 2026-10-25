/**
 * Auth service — now backed by the real API in /server instead of
 * localStorage. Sessions live in an httpOnly cookie set by the server, so
 * the browser never touches the token directly.
 *
 * Function signatures are unchanged from the old demo version, so
 * AuthContext and the pages that use it don't need to know anything changed.
 */
import { api, ApiError as HttpError } from './client.js';

export class AuthError extends Error {}

function rethrow(err) {
  if (err instanceof HttpError) throw new AuthError(err.message);
  throw err;
}

// ---------- validation (kept here so pages can still import it) ----------
export function passwordIssue(pw) {
  if (!pw || pw.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Use both letters and numbers';
  return '';
}

// ---------- session ----------
export async function getCurrentUser() {
  try {
    const { user } = await api.get('/api/auth/me');
    return user;
  } catch (err) {
    if (err instanceof HttpError && (err.status === 401 || err.status === 0)) return null;
    throw err;
  }
}

// ---------- public API ----------
export async function signup({ name, email, phone, password }) {
  try {
    const { user } = await api.post('/api/auth/signup', { name, email, phone, password });
    return user;
  } catch (err) {
    rethrow(err);
  }
}

export async function login({ email, password, remember = true }) {
  try {
    const { user } = await api.post('/api/auth/login', { email, password, remember });
    return user;
  } catch (err) {
    rethrow(err);
  }
}

export async function logout() {
  try {
    await api.post('/api/auth/logout');
  } catch {
    /* logging out should never throw in the UI */
  }
}

export async function updateProfile(userId, { name, phone }) {
  try {
    const { user } = await api.patch('/api/users/me', { name, phone });
    return user;
  } catch (err) {
    rethrow(err);
  }
}

export async function changePassword(userId, current, next) {
  try {
    await api.patch('/api/users/me/password', { current, next });
  } catch (err) {
    rethrow(err);
  }
}

export async function toggleFavorite(userId, movie) {
  try {
    const { user } = await api.post('/api/users/me/favorites/toggle', { movie });
    return user;
  } catch (err) {
    rethrow(err);
  }
}
