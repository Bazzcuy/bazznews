"use client";

import { useState } from "react";
import styles from "./AITranslator.module.css";

export default function AITranslator({ articleText, onTranslate }) {
  const [language, setLanguage] = useState("id");
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: "id", name: "🇮🇩 Indonesia" },
    { code: "English", name: "🇬🇧 English" },
    { code: "Japanese", name: "🇯🇵 日本語" },
    { code: "Arabic", name: "🇸🇦 العربية" },
    { code: "Korean", name: "🇰🇷 한국어" },
  ];

  const handleLanguageChange = async (e) => {
    const targetLang = e.target.value;
    setLanguage(targetLang);
    
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

      // Ubah text dengan convert newline ke <p>
      const html = data.translatedText.split('\n\n').map(p => `<p>${p}</p>`).join('');
      onTranslate(html);
    } catch (err) {
      alert(`⚠️ Gagal menerjemahkan: ${err.message}`);
      setLanguage("id");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.translatorWrapper}>
      <label className={styles.label}>Terjemahkan:</label>
      <select 
        value={language} 
        onChange={handleLanguageChange} 
        className={styles.select}
        disabled={isLoading}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} {isLoading && lang.code === language ? "..." : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
