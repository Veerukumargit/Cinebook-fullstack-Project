import { COOKIE_NAME, verifyToken } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function loadUserFromRequest(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }
  return User.findById(payload.sub);
}

/** Requires a signed-in user; attaches it to req.user. */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const user = await loadUserFromRequest(req);
  if (!user) throw ApiError.unauthorized();
  req.user = user;
  next();
});

/** Attaches req.user if signed in, but never blocks the request. */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  req.user = await loadUserFromRequest(req);
  next();
});
