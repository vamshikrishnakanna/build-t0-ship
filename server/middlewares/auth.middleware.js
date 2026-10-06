/**
 * server/middlewares/auth.middleware.js
 * JWT authentication middleware.
 * Verifies the Bearer token and attaches req.user for downstream handlers.
 */

import jwt from 'jsonwebtoken';

/**
 * Protects routes by requiring a valid JWT in the Authorization header.
 * Sets req.user = { id, email } on success.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Authorization denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}
