import mongoose from 'mongoose';

const VALID_TAGS = ['work', 'family', 'health', 'study'];

const moodSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
    color: { type: String, default: '#818cf8' },
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'voice', 'file'], required: true },
    url: { type: String, required: true },
    name: { type: String, default: '' },
  },
  { _id: false }
);

const journalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mood: { type: moodSchema, required: true },
    emoji: { type: String, index: true },
    text: { type: String, required: true, trim: true, maxlength: 5000 },
    richContent: { type: String, default: '' },
    intensity: { type: Number, min: 1, max: 10, default: 5 },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(tags) {
          return tags.every((tag) => VALID_TAGS.includes(tag));
        },
        message: 'Invalid tag provided',
      },
    },
    isFavorite: { type: Boolean, default: false, index: true },
    attachments: [attachmentSchema],
    location: {
      label: String,
      lat: Number,
      lng: Number,
    },
    weather: {
      condition: String,
      temp: Number,
    },
    voiceNote: { type: String, default: '' },
    aiAnalysis: {
      sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
      emotions: [{ type: String }],
      stressScore: { type: Number, min: 0, max: 10 },
      energyScore: { type: Number, min: 0, max: 10 },
      positivityScore: { type: Number, min: 0, max: 100 },
      keywords: [{ type: String }],
      triggers: [{ type: String }],
      summary: { type: String, default: '' },
      suggestions: [{ type: String }],
      source: { type: String, enum: ['ai', 'local'], default: 'local' },
    },
  },
  { timestamps: true }
);

journalEntrySchema.pre('validate', function syncEmoji(next) {
  if (this.mood?.emoji) this.emoji = this.mood.emoji;
  next();
});

journalEntrySchema.index({ user: 1, createdAt: -1 });
journalEntrySchema.index({ user: 1, 'mood.emoji': 1 });
journalEntrySchema.index({ user: 1, 'mood.category': 1 });
journalEntrySchema.index({ user: 1, tags: 1 });
journalEntrySchema.index({ text: 'text' });

export { VALID_TAGS };
export default mongoose.model('JournalEntry', journalEntrySchema);
