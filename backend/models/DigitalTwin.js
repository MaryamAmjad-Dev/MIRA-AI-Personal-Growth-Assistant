import mongoose from 'mongoose';

const digitalTwinSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    personalityType: { type: String, default: 'Explorer' },
    communicationStyle: { type: String, default: 'Reflective' },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    repeatedPatterns: [{ type: String }],
    decisionHistory: [{
      decision: String,
      outcome: String,
      date: { type: Date, default: Date.now },
    }],
    lifeValues: [{ type: String }],
    writingStyle: { type: String, default: '' },
    evolutionSnapshots: [{
      month: String,
      summary: String,
      traits: [String],
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.model('DigitalTwin', digitalTwinSchema);
