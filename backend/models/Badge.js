import mongoose from 'mongoose';

const badgeDefinitionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  xpReward: { type: Number, default: 50 },
  criteria: { type: String, required: true },
});

const userBadgeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    badgeKey: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userBadgeSchema.index({ user: 1, badgeKey: 1 }, { unique: true });

export const BADGE_DEFINITIONS = [
  { key: 'streak_7', title: '7 Day Streak', description: 'Journal 7 days in a row', icon: '🔥', xpReward: 100, criteria: 'streak_7' },
  { key: 'entries_100', title: '100 Entries', description: 'Write 100 journal entries', icon: '🏆', xpReward: 200, criteria: 'entries_100' },
  { key: 'perfect_week', title: 'Perfect Week', description: 'Complete all habits for 7 days', icon: '💎', xpReward: 150, criteria: 'perfect_week' },
  { key: 'first_habit', title: 'First Habit', description: 'Create your first habit', icon: '🌱', xpReward: 50, criteria: 'first_habit' },
  { key: 'first_goal', title: 'Goal Setter', description: 'Create your first goal', icon: '🎯', xpReward: 50, criteria: 'first_goal' },
  { key: 'coach_chat', title: 'AI Explorer', description: 'Chat with AI Coach', icon: '🤖', xpReward: 75, criteria: 'coach_chat' },
];

export const BadgeDefinition = mongoose.model('BadgeDefinition', badgeDefinitionSchema);
export default mongoose.model('UserBadge', userBadgeSchema);
