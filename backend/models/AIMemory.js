import mongoose from 'mongoose';

const aiMemorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    personalityInsights: [{ type: String }],
    commonMoods: [{ emoji: String, name: String, count: Number }],
    emotionalPatterns: [{ type: String }],
    stressTriggers: [{ type: String }],
    positiveTriggers: [{ type: String }],
    habitPatterns: [{ type: String }],
    goals: [{ type: String }],
    preferences: {
      coachingStyle: { type: String, default: 'supportive' },
      focusAreas: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model('AIMemory', aiMemorySchema);
