import mongoose from 'mongoose';

export const HABIT_CATEGORIES = [
  'health', 'fitness', 'learning', 'hydration', 'meditation',
  'coding', 'sleep', 'reading', 'finance', 'goals',
];

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    icon: { type: String, default: '✅' },
    category: { type: String, enum: HABIT_CATEGORIES, default: 'health' },
    frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
    target: { type: Number, default: 1, min: 1 },
    streak: { type: Number, default: 0 },
    completedDates: [{ type: String }],
    reminderTime: { type: String, default: '' },
    color: { type: String, default: '#818cf8' },
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Habit', habitSchema);
