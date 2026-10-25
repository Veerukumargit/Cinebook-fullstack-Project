/** Thrown anywhere in the app to produce a specific HTTP status + message. */
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }
  static unauthorized(message = 'Please log in to continue.') {
    return new ApiError(401, message);
  }
  static forbidden(message = 'You cannot do that.') {
    return new ApiError(403, message);
  }
  static notFound(message = 'Not found.') {
    return new ApiError(404, message);
  }
  static conflict(message, details) {
    return new ApiError(409, message, details);
  }
  static tooMany(message) {
    return new ApiError(429, message);
  }
  static server(message = 'Something went wrong. Please try again.') {
    return new ApiError(500, message);
  }
}
