import express from 'express';
import { signup, login, logoutUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logoutUser);

export default router;
