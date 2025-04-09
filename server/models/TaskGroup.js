import mongoose from 'mongoose';

const taskGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  color: { type: String, default: "gray" },
  code: { type: String, unique: true, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    },
  ],
});

export default mongoose.model('TaskGroup', taskGroupSchema);