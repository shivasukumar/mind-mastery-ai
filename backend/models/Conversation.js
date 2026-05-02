const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: String,
  text: String,
  mood: String,
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;