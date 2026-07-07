import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { AuthError } from '../utils/errors.js';
import { sendError } from '../utils/apiResponse.js';

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('Authentication required');
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      throw new AuthError('Authentication required');
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AuthError('User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 'Invalid or expired token', 401);
    }
    if (error instanceof AuthError) {
      return sendError(res, error.message, 401);
    }
    next(error);
  }
}
