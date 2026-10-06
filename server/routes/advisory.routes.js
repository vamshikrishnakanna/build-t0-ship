/**
 * server/routes/advisory.routes.js
 * Advisory generation and retrieval routes — all protected by JWT.
 */

import { Router } from 'express';
import {
  generateAdvisoryHandler,
  getAdvisoryById,
  getAllAdvisories,
} from '../controllers/advisory.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { AdvisoryRequestSchema } from '../validators/advisory.validator.js';

const router = Router();

// All advisory routes require authentication
router.use(authenticate);

// GET /api/advisory — list all advisories for user
router.get('/', getAllAdvisories);

// POST /api/advisory/generate — trigger AI generation
router.post('/generate', validate(AdvisoryRequestSchema), generateAdvisoryHandler);

// GET /api/advisory/:id — get specific advisory
router.get('/:id', getAdvisoryById);

export default router;
