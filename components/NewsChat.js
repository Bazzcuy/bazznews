"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./NewsChat.module.css";

export default function NewsChat({ articleText }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Halo! Saya AI Bazznews. Tanyakan apa saja seputar berita di atas." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleText,
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: `⚠️ Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <h3 className={styles.chatTitle}>Tanya AI Tentang Berita Ini</h3>
      <div className={styles.chatBox}>
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.botMessage}`}>
              <span className={styles.avatar}>{m.role === 'user' ? '👤' : '🤖'}</span>
              <div className={styles.messageText}>{m.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <span className={styles.avatar}>🤖</span>
              <div className={styles.typing}>AI sedang mengetik...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.chatForm} onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Tanya apa saja..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.chatInput}
            disabled={isLoading}
          />
          <button type="submit" className={styles.chatBtn} disabled={isLoading}>
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
