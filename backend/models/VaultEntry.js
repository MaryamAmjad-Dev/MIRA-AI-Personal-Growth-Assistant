import mongoose from 'mongoose';

const vaultEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    encryptedContent: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    title: { type: String, default: 'Private Entry', maxlength: 120 },
  },
  { timestamps: true }
);

export default mongoose.model('VaultEntry', vaultEntrySchema);
