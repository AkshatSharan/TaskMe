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
    .post(protect, createTask);

router.route('/user/:id').get(protect, getTasks)

router.route('/:id')
    .get(protect, getTaskDetails)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

export default router;
