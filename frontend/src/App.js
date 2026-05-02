import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", text: input };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    const res = await fetch("https://mind-mastery-ai.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: "user1",
        message: input
      })
    });

    const data = await res.json();
    setLoading(false);

    const botMessage = { role: "assistant", text: data.reply };

    setMessages(prev => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div className="app">
      <h2>Mind Mastery AI</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-msg" : "bot-msg"}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="bot-msg">Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type how you feel..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;