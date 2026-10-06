/**
 * server/validators/auth.validator.js
 * Zod schemas for authentication payloads.
 */

import { z } from 'zod';

export const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});
