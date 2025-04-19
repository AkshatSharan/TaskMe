import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Task from '../models/Task.js';
import TaskGroup from '../models/TaskGroup.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
};

export const leaveGroup = async (req, res) => {
    const userId = req.user._id;
    const { groupId } = req.params;

    try {
        const group = await TaskGroup.findById(groupId).populate('tasks');

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        group.members = group.members.filter(member => member.toString() !== userId.toString());

        for (const taskId of group.tasks) {
            const task = await Task.findById(taskId);

            if (!task) continue;

            if (task.assignedTo.some(id => id.toString() === userId.toString())) {

                if (task.assignedTo.length === 1) {
                    await Task.findByIdAndDelete(task._id);

                    group.tasks = group.tasks.filter(tid => tid.toString() !== task._id.toString());

                    await User.updateMany(
                        { tasks: task._id },
                        { $pull: { tasks: task._id } }
                    );

                } else {
                    task.assignedTo = task.assignedTo.filter(id => id.toString() !== userId.toString());
                    await task.save();
                }
            }
        }

        await group.save();

        await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

        await User.findByIdAndUpdate(userId, {
            $pull: { tasks: { $in: group.tasks } }
        });

        return res.status(200).json({ message: 'You have left the group successfully.' });

    } catch (error) {
        console.error('Error while leaving group:', error);
        return res.status(500).json({ message: 'Server error. Could not leave group.' });
    }
};