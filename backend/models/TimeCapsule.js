import mongoose from 'mongoose';

const timeCapsuleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Letter to Future Me' },
    message: { type: String, required: true, maxlength: 5000 },
    unlockDate: { type: Date, required: true, index: true },
    locked: { type: Boolean, default: true },
    openedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('TimeCapsule', timeCapsuleSchema);
