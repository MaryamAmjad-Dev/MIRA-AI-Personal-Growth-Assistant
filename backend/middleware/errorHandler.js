import { sendError } from '../utils/apiResponse.js';
import { AppError, ValidationError } from '../utils/errors.js';

export function notFoundHandler(_req, res) {
  sendError(res, 'Route not found', 404);
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err instanceof ValidationError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  if (err.name === 'CastError') {
    return sendError(res, 'Invalid resource ID', 400);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 'Validation failed', 400, errors);
  }

  if (err.code === 11000) {
    return sendError(res, 'Email already registered', 409);
  }

  if (err.message?.includes('CORS blocked')) {
    return sendError(res, 'Origin not allowed by CORS policy', 403);
  }

  sendError(res, err.message || 'Internal server error', err.statusCode || 500);
}
