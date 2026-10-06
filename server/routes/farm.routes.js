/**
 * server/routes/farm.routes.js
 * Farm profile routes — all protected by JWT authentication.
 */

import { Router } from 'express';
import {
  getFarms,
  getFarmById,
  createFarm,
  deleteFarm,
} from '../controllers/farm.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { FarmSchema } from '../validators/farm.validator.js';

const router = Router();

// All farm routes require authentication
router.use(authenticate);

// GET /api/farms — list all farms for user
router.get('/', getFarms);

// GET /api/farms/:id — get specific farm
router.get('/:id', getFarmById);

// POST /api/farms — create new farm
router.post('/', validate(FarmSchema), createFarm);

// DELETE /api/farms/:id — delete farm
router.delete('/:id', deleteFarm);

export default router;
