import express from "express";
import { createGroup, joinGroupByCode, getUserGroups, getGroupById, approveOrRejectJoinRequest } from "../controllers/taskGroupController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.post("/join/:code", protect, joinGroupByCode);
router.get("/my-groups", protect, getUserGroups);
router.get("/:id", protect, getGroupById);
router.post('/:groupId/requests/:requestId', protect, approveOrRejectJoinRequest);

export default router;
