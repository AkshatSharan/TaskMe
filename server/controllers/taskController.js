import Task from '../models/Task.js';
import TaskGroup from '../models/TaskGroup.js';
import User from '../models/User.js';

export const createTask = async (req, res) => {
    const { title, description, deadline, priority, status, assignedTo, groupId } = req.body;

    try {
        if (!title || !groupId) {
            return res.status(400).json({ message: "Title and Group ID are required." });
        }

        const group = await TaskGroup.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found." });

        const task = new Task({
            title,
            description,
            deadline,
            priority,
            status,
            group: groupId,
            createdBy: req.user._id,
            assignedTo: assignedTo ? [assignedTo] : [],
        });

        const savedTask = await task.save();

        if (!group.tasks.includes(savedTask._id)) {
            group.tasks.push(savedTask._id);
        }

        if (assignedTo) {
            const user = await User.findById(assignedTo);
            if (!user) return res.status(404).json({ message: "Assigned user not found." });

            if (!user.groups.includes(groupId)) {
                user.groups.push(groupId);
            }

            if (!user.tasks.includes(savedTask._id)) {
                user.tasks.push(savedTask._id);
            }

            await user.save();
        }

        if (assignedTo && !group.members.includes(assignedTo)) {
            group.members.push(assignedTo);
        }

        await group.save();

        console.log("Task saved:", savedTask._id);
        console.log("Group tasks:", group.tasks);
        if (assignedTo) {
            const updatedUser = await User.findById(assignedTo);
            console.log("User tasks:", updatedUser.tasks);
        }

        res.status(201).json(savedTask);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Failed to create task", error: err.message });
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