import mongoose from 'mongoose';

const customMoodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    emoji: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
    color: { type: String, default: '#818cf8' },
  },
  { timestamps: true }
);

customMoodSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('CustomMood', customMoodSchema);
