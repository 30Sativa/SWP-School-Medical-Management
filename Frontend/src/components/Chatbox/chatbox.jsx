import React, { useState, useEffect, useRef } from "react";
import styles from "../../components/Chatbox/chatbox.module.css";
import { MessageCircle } from "lucide-react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (!hasGreeted.current) {
      setMessages([
        {
          role: "bot",
          text: "👩‍⚕️ Xin chào, tôi là y tá ảo của hệ thống EduHealth, tôi có thể giúp gì cho bạn?",
        },
      ]);
      hasGreeted.current = true;
    }
  }, []);

  const API_KEY = "AIzaSyD8vTLu6Kn5n0ddy45CHdlXSHhZqUzB6j8";
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: input }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      });

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.promptFeedback?.blockReason ||
        "❌ Không có phản hồi từ Medical AI.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (error) {
      console.error("Lỗi Gemini:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Lỗi khi kết nối Medical AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatArea}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.role === "user" ? styles.right : styles.left
            }`}
          >
            <div
              className={styles.bubble}
              style={{
                backgroundColor: msg.role === "user" ? "#0ea5e9" : "#e5e7eb",
                color: msg.role === "user" ? "#fff" : "#111",
              }}
            >
              <b>{msg.role === "user" ? "Bạn" : "Medical AI"}:</b> {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className={styles.loading}>⏳ Đang trả lời...</div>}
      </div>
      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.button}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
