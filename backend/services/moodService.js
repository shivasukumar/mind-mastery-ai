function detectMood(message) {
  const text = message.toLowerCase();

  if (text.includes("stress") || text.includes("overwhelmed")) {
    return "stressed";
  }
  if (text.includes("sad") || text.includes("down")) {
    return "sad";
  }
  if (text.includes("anxious") || text.includes("worried")) {
    return "anxious";
  }
  if (text.includes("happy") || text.includes("good")) {
    return "happy";
  }

  return "neutral";
}

module.exports = { detectMood };