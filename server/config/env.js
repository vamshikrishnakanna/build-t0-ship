/**
 * server/config/env.js
 * Validates all required environment variables on server startup.
 * Throws immediately if any critical variable is missing.
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GEMINI_API_KEY',
];

/**
 * Validates that all required environment variables are set.
 * @throws {Error} if any required variable is missing or JWT_SECRET is too short.
 */
export function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[ENV] Missing required environment variables: ${missing.join(', ')}\n` +
        `Please copy .env.example to .env and fill in all values.`
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error(
      '[ENV] JWT_SECRET must be at least 32 characters long for security.'
    );
  }

  console.log('[ENV] ✅ All required environment variables are set.');
}
