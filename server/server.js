import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import taskGroupRoutes from './routes/taskGroupRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => res.status(200).send("TaskMe backend is running :)"));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', taskGroupRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))