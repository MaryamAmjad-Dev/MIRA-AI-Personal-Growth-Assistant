import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { toPublicAvatar } from '../utils/userAvatar.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
      required: function requiredPassword() {
        return this.provider === 'local';
      },
    },
    avatar: { type: String, default: '' },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      index: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    bio: { type: String, default: '', maxlength: 300 },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'female' },
    avatarType: {
      type: String,
      enum: ['male', 'female', 'custom', 'upload'],
      default: 'female',
    },
    avatarConfig: { type: mongoose.Schema.Types.Mixed, default: null },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    favoriteMoods: [{ type: String }],
    recentMoods: [{ type: String }],
    preferences: {
      dashboardLayout: { type: String, default: 'default' },
      journalReminder: { type: String, default: '20:00' },
      habitReminders: { type: Boolean, default: true },
      onboardingComplete: { type: Boolean, default: false },
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  if (this.provider !== 'local') return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.addXp = function addXp(amount) {
  this.xp += amount;
  this.level = Math.floor(this.xp / 200) + 1;
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const avatar = toPublicAvatar(this);
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar,
    provider: this.provider,
    bio: this.bio,
    timezone: this.timezone,
    language: this.language,
    gender: this.gender,
    avatarType: avatar.type,
    avatarConfig: avatar.config,
    xp: this.xp,
    level: this.level,
    favoriteMoods: this.favoriteMoods,
    recentMoods: this.recentMoods,
    preferences: this.preferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model('User', userSchema);
