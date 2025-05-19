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

export const approveOrRejectJoinRequest = async (req, res) => {
    const { groupId, requestId } = req.params;
    const { action } = req.body;

    try {
        const group = await TaskGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const joinRequest = group.joinRequests.find(
            (req) => req._id.toString() === requestId
        );

        if (!joinRequest) {
            return res.status(404).json({ message: "Join request not found" });
        }

        const userId = joinRequest.user;

        if (action === "approve") {
            if (!group.members.includes(userId)) {
                group.members.push(userId);
            }

            await User.findByIdAndUpdate(userId, {
                $addToSet: { groups: group._id },
            });
        }

        group.joinRequests = group.joinRequests.filter(
            (req) => req._id.toString() !== requestId
        );

        await group.save();

        res.status(200).json({ message: `Request ${action}d successfully` });

    } catch (error) {
        console.error("Error processing join request:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const getUserGroups = async (req, res) => {
    try {
        const groups = await TaskGroup.find({
            $or: [
                { members: req.user._id }
            ]
        }).populate({
            path: "tasks",
            populate: {
                path: "assignedTo",
                select: "name"
            }
        })
            .populate("members", "name email")
            .populate("joinRequests.user", "name");

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
        const group = await TaskGroup.findById(groupId).populate({
            path: "tasks",
            populate: {
                path: "assignedTo",
                select: "name"
            }
        })
            .populate("members", "name email")
            .populate("joinRequests.user", "name");

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