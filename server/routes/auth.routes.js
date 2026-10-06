/**
 * server/routes/auth.routes.js
 * Authentication routes: register, login, me.
 */

import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { RegisterSchema, LoginSchema } from '../validators/auth.validator.js';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(RegisterSchema), register);

// POST /api/auth/login
router.post('/login', validate(LoginSchema), login);

// GET /api/auth/me — requires valid JWT
router.get('/me', authenticate, getMe);

export default router;
