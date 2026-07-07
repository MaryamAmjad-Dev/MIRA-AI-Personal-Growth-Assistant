import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true, maxlength: 8000 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const aiConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

aiConversationSchema.methods.addMessage = function addMessage(role, content) {
  this.messages.push({ role, content, timestamp: new Date() });
  if (this.messages.length > 100) {
    this.messages = this.messages.slice(-100);
  }
};

export default mongoose.model('AIConversation', aiConversationSchema);
