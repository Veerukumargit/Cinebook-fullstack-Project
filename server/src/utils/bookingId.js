import crypto from 'node:crypto';

/** Human-friendly booking reference, e.g. "CB8F2K3QX7A". Same shape as the old client-side one. */
export function makeBookingId() {
  const time = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 5);
  return `CB${time}${rand}`;
}
