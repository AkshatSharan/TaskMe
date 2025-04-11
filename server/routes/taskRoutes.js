import express from 'express';
import {
    createTask,
    getTasks,
    getTaskDetails,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.route('/:id')
    .get(protect, getTaskDetails)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

export default router;
