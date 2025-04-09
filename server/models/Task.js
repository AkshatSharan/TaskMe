import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    deadline: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in progress', 'done'], default: 'todo' },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskGroup' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Task', taskSchema);