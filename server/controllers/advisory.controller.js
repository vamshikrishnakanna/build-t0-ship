/**
 * server/controllers/advisory.controller.js
 * Handles AI advisory generation and retrieval.
 * Validates the farm ownership before triggering Gemini, then saves to DB.
 */

import { pool } from '../config/db.js';
import { generateAdvisory } from '../services/ai.service.js';
import { AIAdvisoryOutputSchema } from '../validators/advisory.validator.js';

/**
 * POST /api/advisory/generate
 * 1. Verifies the farm belongs to the requesting user (RLS).
 * 2. Calls Gemini AI with farm + season context.
 * 3. Validates the structured JSON response with Zod.
 * 4. Saves the advisory to the DB.
 * 5. Returns the full advisory.
 */
export async function generateAdvisoryHandler(req, res, next) {
  try {
    const { farm_id, season, budget_tier } = req.body;

    // ── RLS: Ensure the farm belongs to the requesting user ──────────────────
    const farmResult = await pool.query(
      `SELECT id, name, location, soil_type, ph_level, irrigation_type
       FROM farms
       WHERE id = $1 AND user_id = $2`,
      [farm_id, req.user.id]
    );

    if (farmResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Farm not found or you do not have permission to access it.',
      });
    }

    const farm = farmResult.rows[0];

    // ── Call Gemini AI ────────────────────────────────────────────────────────
    const rawAIResponse = await generateAdvisory(farm, season, budget_tier);

    // ── Validate the AI response structure with Zod ───────────────────────────
    const validatedResponse = AIAdvisoryOutputSchema.parse(rawAIResponse);

    // ── Save advisory to the database ─────────────────────────────────────────
    const insertResult = await pool.query(
      `INSERT INTO advisories (farm_id, user_id, season, budget_tier, ai_recommendation)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, farm_id, season, budget_tier, ai_recommendation, created_at`,
      [farm_id, req.user.id, season, budget_tier, JSON.stringify(validatedResponse)]
    );

    const advisory = insertResult.rows[0];

    return res.status(201).json({
      message: 'Advisory generated successfully.',
      advisory: {
        ...advisory,
        farm_name: farm.name,
        farm_location: farm.location,
      },
    });
  } catch (err) {
    // Handle Zod validation errors from AI response
    if (err.name === 'ZodError') {
      return res.status(502).json({
        error: 'AI returned an invalid response structure. Please try again.',
        details: err.errors,
      });
    }
    next(err);
  }
}

/**
 * GET /api/advisory/:id
 * Fetches a specific advisory, ensuring it belongs to the authenticated user.
 */
export async function getAdvisoryById(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT a.id, a.season, a.budget_tier, a.ai_recommendation, a.created_at,
              f.name AS farm_name, f.location AS farm_location,
              f.soil_type, f.ph_level, f.irrigation_type
       FROM advisories a
       JOIN farms f ON f.id = a.farm_id
       WHERE a.id = $1 AND a.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Advisory not found or access denied.' });
    }

    return res.status(200).json({ advisory: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/advisory
 * Fetches all advisories for the authenticated user.
 */
export async function getAllAdvisories(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT a.id, a.season, a.budget_tier, a.created_at,
              f.name AS farm_name, f.location AS farm_location
       FROM advisories a
       JOIN farms f ON f.id = a.farm_id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    return res.status(200).json({ advisories: result.rows });
  } catch (err) {
    next(err);
  }
}
