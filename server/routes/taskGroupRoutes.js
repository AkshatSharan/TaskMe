import express from 'express';
import { createGroup, joinGroup } from '../controllers/taskGroupController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createGroup);
router.post('/:groupId/join', protect, joinGroup);

export default router;