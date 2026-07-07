import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
});

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: '', maxlength: 500 },
    type: { type: String, enum: ['yearly', 'monthly', 'custom'], default: 'monthly' },
    deadline: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    milestones: [milestoneSchema],
    color: { type: String, default: '#818cf8' },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, deadline: 1 });

export default mongoose.model('Goal', goalSchema);
