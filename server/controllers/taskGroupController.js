import TaskGroup from '../models/TaskGroup.js';
import User from '../models/User.js';

export const createGroup = async (req, res) => {
    const { name, description } = req.body;
    const groupCode = generateGroupCode();

    const group = new TaskGroup({
        name,
        description,
        code: groupCode,
        createdBy: req.user._id,
    });

    await group.save();
    res.status(201).json(group);
};

export const joinGroup = async (req, res) => {
    const { groupId } = req.params;
    const group = await TaskGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const existingRequest = group.joinRequests.find(req => req.user.toString() === req.user._id.toString());
    if (existingRequest) return res.status(400).json({ message: 'Already requested' });

    group.joinRequests.push({ user: req.user._id, status: 'pending' });
    await group.save();
    res.json({ message: 'Join request sent' });
};

const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const joinTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.assignedTo.includes(userId)) {
            return res.status(400).json({ message: 'Already a member of this task' });
        }

        task.joinRequests.push(userId);
        await task.save();

        res.status(200).json({ message: 'Join request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
