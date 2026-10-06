/**
 * server/controllers/auth.controller.js
 * Handles user registration and login.
 * Uses bcryptjs for password hashing and JWT for session tokens.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const BCRYPT_ROUNDS = 12;

/**
 * Generates a signed JWT for the given user payload.
 * @param {{ id: string, email: string }} payload
 * @returns {string} Signed JWT token
 */
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * POST /api/auth/register
 * Creates a new user account.
 */
export async function register(req, res, next) {
  try {
    const { full_name, email, password } = req.body;

    // Check if email is already registered
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Insert new user (parameterized — safe from SQL injection)
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, created_at`,
      [full_name, email, password_hash]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email });

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Fetch user by email
    const result = await pool.query(
      'SELECT id, email, full_name, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    // Use constant-time comparison to prevent timing attacks
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password_hash)
      : await bcrypt.compare(password, '$2b$12$invalidhashfortimingprotection00000000000000');

    if (!user || !passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken({ id: user.id, email: user.email });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
export async function getMe(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}
