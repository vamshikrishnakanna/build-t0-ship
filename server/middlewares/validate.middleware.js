/**
 * server/middlewares/validate.middleware.js
 * Generic Zod validation middleware factory.
 * Usage: router.post('/path', validate(MySchema), controller)
 */

import { ZodError } from 'zod';

/**
 * Returns an Express middleware that validates req.body against the given Zod schema.
 * Sends a 422 with structured field errors on failure.
 * @param {import('zod').ZodSchema} schema
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(422).json({
          error: 'Validation failed',
          details: errors,
        });
      }
      next(err);
    }
  };
}
