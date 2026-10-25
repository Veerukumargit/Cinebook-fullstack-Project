import { ApiError } from '../utils/ApiError.js';
import { isProd } from '../config/env.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `No route: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  if (err?.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: 'That value is already in use.' });
  }
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Please log in again.' });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: isProd ? 'Something went wrong. Please try again.' : err.message });
}
