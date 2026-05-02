const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getAIResponse(message, mood, history, dominantMood) {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: ` You are a mental wellness assistant.

Current mood: ${mood}
Past dominant mood: ${dominantMood}

STRICT STRUCTURE:
1. Acknowledge the user’s feeling briefly
2. Give ONE simple actionable suggestion (only one action)
3. Ask ONE short follow-up question

RULES:
- Keep response short (2–3 sentences only)
- Do NOT give multiple suggestions
- Do NOT use words like "or", "and", or combine actions
- Keep the suggestion simple (one action, not multiple steps)
- Do NOT use bullet points, lists, or formatting
- Do NOT give long explanations
- Keep total response under 60 words
- Suggestion must be ONE simple action that can be done immediately without steps
- Suggestion must be ONE simple action in a single short sentence
- Do NOT include steps, numbers, or sequences

BEHAVIOR:
- If the same mood appears repeatedly, gently acknowledge it
- Adapt tone based on mood:
  - stressed → calming
  - sad → empathetic
  - anxious → reassuring
  - happy → encouraging

TONE:
- Calm
- Supportive
- Natural
- Human-like

`
      },
      ...history,
      {
        role: "user",
        content: message
      }
    ]
  });

  let text = response.choices[0].message.content;

  // Limit length
  if (text.length > 300) {
    text = text.substring(0, 300);
  }

  text = text.replace(/[#*|>-]/g, "");

  return text;
}

module.exports = { getAIResponse };