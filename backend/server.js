require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const Conversation = require("./models/Conversation");
const { getAIResponse } = require("./services/llmService");
const { detectMood } = require("./services/moodService");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server + DB");
});

app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  try {
    const mood = detectMood(message);
    let convo = await Conversation.findOne({ userId });

    if (!convo) {
      convo = new Conversation({ userId, messages: [] });
    }

    const history = convo ? convo.messages : [];

    const moods = history.map(msg => msg.mood).filter(Boolean);

    const moodCount = {};
    moods.forEach(m => {
      moodCount[m] = (moodCount[m] || 0) + 1;
    });

    let dominantMood = "neutral";
    let max = 0;

    for (let key in moodCount) {
      if (moodCount[key] > max) {
        max = moodCount[key];
        dominantMood = key;
      }
    }

    const recentMessages = history.slice(-6); // last 6 messages

    const formattedHistory = recentMessages.map(msg => ({
      role: msg.role,
      content: msg.text
    }));

    // Save user message
    convo.messages.push({
      role: "user",
      text: message,
      mood: mood
    });

    // Get AI response
    const aiReply = await getAIResponse(message, mood, formattedHistory, dominantMood);

    // Save AI response
    convo.messages.push({
      role: "assistant",
      text: aiReply,
      mood: "support/calm"
    });

    await convo.save();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();