// Same rules as the frontend used to enforce client-side only — now enforced
// authoritatively on the server too.

export const EMAIL_RE = /^\S+@\S+\.\S+$/;
export const PHONE_RE = /^[6-9]\d{9}$/;

export function passwordIssue(pw) {
  if (!pw || pw.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Use both letters and numbers';
  return '';
}

export function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}
