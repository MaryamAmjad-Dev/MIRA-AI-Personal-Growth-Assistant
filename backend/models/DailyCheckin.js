import mongoose from 'mongoose';

const dailyCheckinSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    feeling: { type: String, default: '' },
    sleepQuality: { type: Number, min: 1, max: 10, default: 5 },
    energyLevel: { type: Number, min: 1, max: 10, default: 5 },
    stressLevel: { type: Number, min: 1, max: 10, default: 5 },
    todayGoal: { type: String, default: '' },
    wellnessScore: { type: Number, min: 0, max: 100 },
    advice: { type: String, default: '' },
    aiInsights: [{ type: String }],
  },
  { timestamps: true }
);

dailyCheckinSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyCheckin', dailyCheckinSchema);
