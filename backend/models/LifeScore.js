import mongoose from 'mongoose';

const lifeScoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    overall: { type: Number, min: 0, max: 100, default: 0 },
    mentalHealth: { type: Number, min: 0, max: 100, default: 0 },
    productivity: { type: Number, min: 0, max: 100, default: 0 },
    consistency: { type: Number, min: 0, max: 100, default: 0 },
    growth: { type: Number, min: 0, max: 100, default: 0 },
    balance: { type: Number, min: 0, max: 100, default: 0 },
    explanation: { type: String, default: '' },
    previousOverall: { type: Number },
  },
  { timestamps: true }
);

lifeScoreSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('LifeScore', lifeScoreSchema);
