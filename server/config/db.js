/**
 * server/config/db.js
 * PostgreSQL connection pool configuration using the `pg` module.
 * Runs the schema migration SQL to create tables if they don't exist.
 */

import pg from 'pg';

const { Pool } = pg;

/** Shared connection pool — reuse across all queries. */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * SQL DDL: Creates all required tables if they do not already exist.
 * This acts as a lightweight migration on server startup.
 */
const SCHEMA_SQL = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TABLE IF NOT EXISTS users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name    VARCHAR(255),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS farms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    location        VARCHAR(255) NOT NULL,
    soil_type       VARCHAR(50)  NOT NULL,
    ph_level        NUMERIC(4,2) NOT NULL,
    irrigation_type VARCHAR(50)  NOT NULL,
    acreage         NUMERIC(10,2),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS advisories (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id           UUID REFERENCES farms(id) ON DELETE CASCADE,
    user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
    season            VARCHAR(50) NOT NULL,
    budget_tier       VARCHAR(50) NOT NULL,
    ai_recommendation JSONB NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  ALTER TABLE farms ADD COLUMN IF NOT EXISTS acreage NUMERIC(10,2);
  ALTER TABLE advisories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

  CREATE INDEX IF NOT EXISTS idx_farms_user_id       ON farms(user_id);
  CREATE INDEX IF NOT EXISTS idx_advisories_farm_id  ON advisories(farm_id);
  CREATE INDEX IF NOT EXISTS idx_advisories_user_id  ON advisories(user_id);
`;

/**
 * Connects to PostgreSQL and runs the schema migration.
 * Called once on server startup.
 */
export async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('[DB] ✅ Connected to PostgreSQL');

    await client.query(SCHEMA_SQL);
    console.log('[DB] ✅ Schema migration complete');

    client.release();
  } catch (err) {
    console.error('[DB] ❌ Failed to connect or migrate:', err.message);
    process.exit(1);
  }
}
