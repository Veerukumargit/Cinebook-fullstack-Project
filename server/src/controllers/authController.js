import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { EMAIL_RE, PHONE_RE, passwordIssue, normalizeEmail } from '../utils/validators.js';
import { COOKIE_NAME, cookieOptions, signToken } from '../utils/token.js';

const SALT_ROUNDS = 12;

// ---------- failed-login throttle (per email, in-memory) ----------
const attempts = new Map();
function checkThrottle(email) {
  const a = attempts.get(email);
  if (a?.until && a.until > Date.now()) {
    throw ApiError.tooMany(
      `Too many failed attempts. Try again in ${Math.ceil((a.until - Date.now()) / 1000)}s.`
    );
  }
}
function recordFailure(email) {
  const a = attempts.get(email) || { count: 0 };
  a.count += 1;
  if (a.count >= 5) {
    a.until = Date.now() + 60_000;
    a.count = 0;
  }
  attempts.set(email, a);
}

function issueSession(res, userId, remember) {
  const { token, maxAge } = signToken(userId, remember);
  res.cookie(COOKIE_NAME, token, cookieOptions(maxAge));
}

export const signup = asyncHandler(async (req, res) => {
  let { name, email, phone, password } = req.body || {};
  name = (name || '').trim();
  email = normalizeEmail(email);

  if (name.length < 2) throw ApiError.badRequest('Enter your full name');
  if (!EMAIL_RE.test(email)) throw ApiError.badRequest('Enter a valid email address');
  if (!PHONE_RE.test(phone || '')) throw ApiError.badRequest('Enter a valid 10-digit mobile number');
  const issue = passwordIssue(password);
  if (issue) throw ApiError.badRequest(issue);

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, phone, passwordHash });

  issueSession(res, user._id.toString(), true);
  res.status(201).json({ user: user.toPublicJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password || '';
  const remember = req.body?.remember !== false;

  if (!EMAIL_RE.test(email) || !password) throw ApiError.badRequest('Enter your email and password');
  checkThrottle(email);

  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) {
    recordFailure(email);
    throw ApiError.unauthorized('Invalid email or password');
  }
  attempts.delete(email);

  issueSession(res, user._id.toString(), remember);
  res.json({ user: user.toPublicJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions(0));
  res.status(204).end();
});

// req.user is guaranteed here because this route is mounted behind requireAuth.
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});
