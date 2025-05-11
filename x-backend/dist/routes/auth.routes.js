import express from 'express';
import { getMe, login, logout, signUp } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/protectedRoute.js';
const router = express.Router();
router.get('/me', protectedRoute, getMe);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
export default router;
