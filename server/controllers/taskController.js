import Task from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        const { name, priority, group, status } = req.body;

        if (!name || !priority || !group || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const task = await Task.create({
            name,
            priority,
            group,
            status,
            createdBy: req.user._id
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTaskDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }

        await task.remove();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};