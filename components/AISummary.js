"use client";

import { useState } from "react";
import styles from "./AISummary.module.css";
import { SparklesIcon } from "./Icons";

export default function AISummary({ articleText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const generateSummary = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    
    setIsOpen(true);
    
    if (!summary) {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ articleText }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Gagal mendapatkan ringkasan");
        }

        setSummary(data.summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.button} ${isOpen ? styles.buttonActive : ""}`} 
        onClick={generateSummary}
      >
        <span className={styles.icon}><SparklesIcon /></span>
        {isOpen ? "Tutup Ringkasan" : "AI Smart Summary"}
      </button>

      {isOpen && (
        <div className={styles.contentBox}>
          <div className={styles.header}>
            <h4>Ringkasan Cerdas AI</h4>
            <span className={styles.badge}>Beta</span>
          </div>
          
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.shimmer}></div>
              <div className={styles.shimmer} style={{ width: '80%' }}></div>
              <div className={styles.shimmer} style={{ width: '90%' }}></div>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>⚠️ {error}</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {summary && summary.map((point, index) => (
                <li key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
