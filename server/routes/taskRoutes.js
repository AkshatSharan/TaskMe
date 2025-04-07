import express from 'express';
import {
    createTask,
    getTasks,
    getTaskDetails,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';

import protect from '../middleware/authMiddleware.js';
import { joinTask } from '../controllers/taskGroupController.js';

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.get('/:id', protect, getTaskDetails);
router.post('/:id/join', protect, joinTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;