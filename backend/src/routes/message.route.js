import express from "express";
import { getMessageByUserId, sendMessage, getChatPartners, markMessagesAsSeen } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";

const router = express.Router();

// the middleware execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting
// before hitting the auth middleware.
router.use(arcjetProtection, protectRoute);
  
router.get("/chats", getChatPartners);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessage);
router.put("/seen/:id", protectRoute, markMessagesAsSeen);

export default router;