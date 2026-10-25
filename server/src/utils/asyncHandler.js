/** Wraps an async Express handler so rejected promises reach errorHandler. */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
