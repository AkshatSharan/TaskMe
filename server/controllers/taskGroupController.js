import TaskGroup from '../models/TaskGroup.js';
import User from '../models/User.js';

export const createGroup = async (req, res) => {
    const { name, description, color } = req.body;
    const groupCode = generateGroupCode();

    try {
        const group = new TaskGroup({
            name,
            description,
            color,
            code: groupCode,
            createdBy: req.user._id,
            members: [req.user._id],
        });

        const savedGroup = await group.save();

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { groups: savedGroup._id }
        });

        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(500).json({ message: "Failed to create group", error: err.message });
    }
};

export const joinGroupByCode = async (req, res) => {
    const { code } = req.params;
    const userId = req.user._id;

    try {
        const group = await TaskGroup.findOne({ code: code.toUpperCase() });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "You are already a member of this group." });
        }

        const existingRequest = group.joinRequests.find(
            (req) => req.user.toString() === userId.toString()
        );

        if (existingRequest) {
            return res.status(400).json({ message: "You have already requested to join this group." });
        }

        group.joinRequests.push({ user: userId });
        await group.save();

        res.status(200).json({ message: "Join request sent successfully. Awaiting approval." });
    } catch (err) {
        res.status(500).json({ message: "Failed to send join request", error: err.message });
    }
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

export const getUserGroups = async (req, res) => {
    try {
        const groups = await TaskGroup.find({
            $or: [
                { createdBy: req.user._id },
                { members: req.user._id }
            ]
        }).populate("members", "name email");

        res.status(200).json(groups);
    } catch (error) {
        console.error("Error in getUserGroups:", error);
        res.status(500).json({ message: "Failed to fetch groups", error: error.message });
    }
};

export const getGroupById = async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user._id;

    try {
        const group = await TaskGroup.findById(groupId)
            .populate("members", "name email")
            .populate("joinRequests.user", "name email");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isMember = group.members.some(member => member.equals(userId));
        const isCreator = group.createdBy.equals(userId);

        if (!isMember && !isCreator) {
            return res.status(403).json({ message: "You do not have access to this group." });
        }

        res.status(200).json(group);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch group", error: err.message });
    }
};