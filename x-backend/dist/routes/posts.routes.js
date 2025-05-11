import express from "express";
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, likeUnlikePost } from "../controllers/posts.controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";
const router = express.Router();
router.post("/", protectedRoute, createPost);
router.post("/comment/:id", protectedRoute, commentOnPost);
// router.put("/:id", protectedRoute, updatePost);
router.delete("/:id", protectedRoute, deletePost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.get("/all", protectedRoute, getAllPosts);
router.get("/likes/:id", protectedRoute, getLikedPosts);
router.get("/following", protectedRoute, getFollowingPosts); // Assuming this is the correct route for following posts
export default router;
