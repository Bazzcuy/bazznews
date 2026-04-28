"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./NewsChat.module.css";

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function NewsChat({ articleText }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Halo! Saya AI Bazznews. Tanyakan apa saja seputar berita di atas." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset chat when navigating to a different article
  useEffect(() => {
    setMessages([
      { role: "bot", text: "Halo! Saya AI Bazznews. Tanyakan apa saja seputar berita di atas." }
    ]);
    setInput("");
  }, [articleText]);

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
      <h3 className={styles.chatTitle}>
        <BotIcon /> Tanya AI Tentang Berita Ini
      </h3>
      <div className={styles.chatBox}>
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.botMessage}`}>
              <span className={styles.avatarWrapper}>
                {m.role === 'user' ? <UserIcon /> : <BotIcon />}
              </span>
              <div className={styles.messageText}>{m.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <span className={styles.avatarWrapper}>
                <BotIcon />
              </span>
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
