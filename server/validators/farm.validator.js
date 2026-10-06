/**
 * server/validators/farm.validator.js
 * Zod schemas for farm profile payloads.
 */

import { z } from 'zod';

export const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silt'];
export const IRRIGATION_TYPES = ['Rainfed', 'Drip', 'Sprinkler'];

export const FarmSchema = z.object({
  name: z
    .string()
    .min(2, 'Farm name must be at least 2 characters')
    .max(100, 'Farm name must be at most 100 characters'),
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(255),
  soil_type: z.enum(SOIL_TYPES, {
    errorMap: () => ({ message: `Soil type must be one of: ${SOIL_TYPES.join(', ')}` }),
  }),
  ph_level: z
    .number()
    .min(1, 'pH must be at least 1.0')
    .max(14, 'pH must be at most 14.0'),
  irrigation_type: z.enum(IRRIGATION_TYPES, {
    errorMap: () => ({
      message: `Irrigation type must be one of: ${IRRIGATION_TYPES.join(', ')}`,
    }),
  }),
  acreage: z.number().positive('Acreage must be positive').optional(),
});
