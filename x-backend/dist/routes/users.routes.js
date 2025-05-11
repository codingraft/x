import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { followUnfollowProfile, suggestedProfile, updateProfile, userProfile } from "../controllers/users.controller.js";
const router = express.Router();
router.get("/profile/:username", protectedRoute, userProfile);
router.get("/suggested", protectedRoute, suggestedProfile);
router.post("/follow/:id", protectedRoute, followUnfollowProfile);
router.post("/update", protectedRoute, updateProfile);
export default router;
