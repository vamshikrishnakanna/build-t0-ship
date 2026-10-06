/**
 * server/index.js
 * Entry point for the CropAdvisor AI Express server.
 * Validates environment, wires middleware, mounts routes,
 * and connects to PostgreSQL before listening.
 */

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { validateEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import farmRoutes from './routes/farm.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';

// ─── Validate environment variables before anything else ──────────────────────
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/advisory', advisoryRoutes);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🌱 CropAdvisor AI server running on port ${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
})();
