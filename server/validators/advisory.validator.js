/**
 * server/validators/advisory.validator.js
 * Zod schemas for advisory generation requests.
 */

import { z } from 'zod';

export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'Kharif', 'Rabi', 'Zaid'];
export const BUDGET_TIERS = ['Low', 'Medium', 'High'];

export const AdvisoryRequestSchema = z.object({
  farm_id: z.string().uuid('farm_id must be a valid UUID'),
  season: z.enum(SEASONS, {
    errorMap: () => ({ message: `Season must be one of: ${SEASONS.join(', ')}` }),
  }),
  budget_tier: z.enum(BUDGET_TIERS, {
    errorMap: () => ({ message: `Budget tier must be one of: ${BUDGET_TIERS.join(', ')}` }),
  }),
});

/**
 * Zod schema for validating the structured JSON returned by Gemini.
 * Ensures the AI response conforms to the expected shape before saving.
 */
export const AIAdvisoryOutputSchema = z.object({
  recommended_crops: z
    .array(
      z.object({
        crop_name: z.string(),
        suitability_score: z.number().int().min(0).max(100),
        expected_yield_per_acre: z.string(),
        reasoning: z.string(),
      })
    )
    .min(1),
  fertilizer_schedule: z
    .array(
      z.object({
        phase: z.string(),
        action: z.string(),
      })
    )
    .min(1),
  pest_risks: z.array(z.string()).min(1),
});
