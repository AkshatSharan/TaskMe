import express from 'express';
import { registerUser, loginUser, leaveGroup } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login', loginUser);
router.delete('/:groupId/leave', protect, leaveGroup);

export default router;