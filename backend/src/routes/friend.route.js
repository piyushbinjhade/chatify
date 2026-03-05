import express from "express";
import {
  searchUsers,
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
} from "../controllers/friend.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Search users by username
router.get("/search", protectRoute, searchUsers);

// Send friend request
router.post("/request/:userId", protectRoute, sendFriendRequest);

// Get incoming pending requests
router.get("/requests", protectRoute, getPendingRequests);

// Accept request
router.put("/accept/:requestId", protectRoute, acceptFriendRequest);

// Reject request
router.delete("/reject/:requestId", protectRoute, rejectFriendRequest);

// Get friend list
router.get("/list", protectRoute, getFriends);

export default router;