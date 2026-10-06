/**
 * server/controllers/farm.controller.js
 * CRUD operations for farm profiles.
 * All queries enforce user_id isolation (RLS at API level).
 */

import { pool } from '../config/db.js';

/**
 * GET /api/farms
 * Fetches all farms belonging to the authenticated user.
 */
export async function getFarms(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, name, location, soil_type, ph_level, irrigation_type, acreage, created_at
       FROM farms
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({ farms: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/farms/:id
 * Fetches a single farm by ID, ensuring it belongs to the authenticated user.
 */
export async function getFarmById(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, name, location, soil_type, ph_level, irrigation_type, acreage, created_at
       FROM farms
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Farm not found or access denied.' });
    }

    return res.status(200).json({ farm: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/farms
 * Creates a new farm profile for the authenticated user.
 */
export async function createFarm(req, res, next) {
  try {
    const { name, location, soil_type, ph_level, irrigation_type, acreage } = req.body;

    const result = await pool.query(
      `INSERT INTO farms (user_id, name, location, soil_type, ph_level, irrigation_type, acreage)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, location, soil_type, ph_level, irrigation_type, acreage, created_at`,
      [req.user.id, name, location, soil_type, ph_level, irrigation_type, acreage || null]
    );

    return res.status(201).json({
      message: 'Farm profile created successfully.',
      farm: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/farms/:id
 * Deletes a farm profile, ensuring it belongs to the authenticated user.
 */
export async function deleteFarm(req, res, next) {
  try {
    const result = await pool.query(
      'DELETE FROM farms WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Farm not found or access denied.' });
    }

    return res.status(200).json({ message: 'Farm deleted successfully.' });
  } catch (err) {
    next(err);
  }
}
