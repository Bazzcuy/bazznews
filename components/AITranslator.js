"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AITranslator.module.css";

export default function AITranslator({ articleText, onTranslate }) {
  const [language, setLanguage] = useState("id");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "id", name: "🇮🇩 Indonesia" },
    { code: "English", name: "🇬🇧 English" },
    { code: "Japanese", name: "🇯🇵 日本語" },
    { code: "Arabic", name: "🇸🇦 العربية" },
    { code: "Korean", name: "🇰🇷 한국어" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = async (targetLang) => {
    setLanguage(targetLang);
    setIsOpen(false);
    
    if (targetLang === "id") {
      onTranslate(null); // Reset ke original
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleText, language: targetLang })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const html = data.translatedText.split('\n\n').map(p => `<p>${p}</p>`).join('');
      onTranslate(html);
    } catch (err) {
      alert(`⚠️ Gagal menerjemahkan: ${err.message}`);
      setLanguage("id");
    } finally {
      setIsLoading(false);
    }
  };

  const currentLangName = languages.find(l => l.code === language)?.name || "Terjemahkan";

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={`${styles.button} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
        <span>{isLoading ? "Menerjemahkan..." : currentLangName}</span>
        <svg className={`${styles.arrow} ${isOpen ? styles.arrowRotated : ""}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.option} ${language === lang.code ? styles.selectedOption : ""}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
