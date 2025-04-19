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
            assignedTo: Array.isArray(assignedTo) ? assignedTo : assignedTo ? [assignedTo] : [],
        });

        const savedTask = await task.save();

        if (!group.tasks.includes(savedTask._id)) {
            group.tasks.push(savedTask._id);
        }

        if (assignedTo && assignedTo.length) {
            for (let userId of assignedTo) {
                const user = await User.findById(userId);
                if (!user) continue;

                if (!user.groups.includes(groupId)) {
                    user.groups.push(groupId);
                }

                if (!user.tasks.includes(savedTask._id)) {
                    user.tasks.push(savedTask._id);
                }

                await user.save();

                if (!group.members.includes(userId)) {
                    group.members.push(userId);
                }
            }
        }

        await group.save();

        if (assignedTo) {
            const updatedUser = await User.findById(assignedTo);
        }

        res.status(201).json(savedTask);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Failed to create task", error: err.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.id, status: { $ne: "Complete" } }).populate({
            path: "group",
            select: "name id"
        });
        return res.status(200).json(tasks);
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
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndUpdate(task._id, { status: status });

        res.status(200).json({ message: 'Task updated successfully', status });
    } catch (error) {
        console.error("Error updating task:", error);
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

        if (task.group) {
            await TaskGroup.updateOne(
                { _id: task.group },
                { $pull: { tasks: task._id } }
            );
        }

        if (task.assignedTo && task.assignedTo.length > 0) {
            await User.updateMany(
                { _id: { $in: task.assignedTo } },
                { $pull: { tasks: task._id } }
            );
        }

        await task.deleteOne();

        res.status(200).json({ message: 'Task deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};