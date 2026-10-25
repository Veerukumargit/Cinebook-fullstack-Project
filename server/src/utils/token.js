import jwt from 'jsonwebtoken';
import { env, isProd } from '../config/env.js';

export const COOKIE_NAME = 'cb_token';

const DAY_MS = 86_400_000;

function parseDuration(str, fallbackDays) {
  const m = /^(\d+)([smhd])$/.exec(String(str || '').trim());
  if (!m) return fallbackDays * DAY_MS;
  const n = Number(m[1]);
  const mult = { s: 1000, m: 60_000, h: 3_600_000, d: DAY_MS }[m[2]];
  return n * mult;
}

export function signToken(userId, remember) {
  const expiresIn = remember ? env.jwtRememberExpiresIn : env.jwtExpiresIn;
  const token = jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn });
  const maxAge = parseDuration(expiresIn, remember ? 30 : 1);
  return { token, maxAge };
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret); // throws on invalid/expired
}

export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: isProd || env.cookieSecure,
    sameSite: env.cookieSameSite,
    maxAge,
    path: '/',
  };
}
