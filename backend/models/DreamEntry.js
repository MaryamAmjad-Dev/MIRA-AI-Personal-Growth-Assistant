import mongoose from 'mongoose';

const dreamEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    dream: { type: String, required: true, maxlength: 5000 },
    emotions: [{ type: String }],
    symbols: [{ type: String }],
    mood: { type: String, default: 'neutral' },
    aiAnalysis: {
      themes: [String],
      interpretation: String,
      recurringSymbols: [String],
      source: { type: String, enum: ['ai', 'local'], default: 'local' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('DreamEntry', dreamEntrySchema);
