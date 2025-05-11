import express from 'express';
import { protectedRoute } from '../middlewares/protectedRoute.js';
import { deleteNotifications, getAllNotifications } from '../controllers/notifications.controller.js';
const router = express.Router();
router.get('/', protectedRoute, getAllNotifications);
router.delete('/', protectedRoute, deleteNotifications);
export default router;
