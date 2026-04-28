"use client";

import { useState, useEffect } from "react";
import styles from "./FocusMode.module.css";

export default function FocusMode({ onToggle }) {
  const [isActive, setIsActive] = useState(false);
  const [fontSize, setFontSize] = useState(18); // default 1.125rem / 18px
  const [fontFamily, setFontFamily] = useState("sans");
  const [theme, setTheme] = useState("light");

  const toggleFocus = () => {
    const next = !isActive;
    setIsActive(next);
    onToggle(next);
  };

  useEffect(() => {
    // Update global attributes for layout adjustments if needed
    if (isActive) {
      document.body.classList.add("focus-mode-active");
    } else {
      document.body.classList.remove("focus-mode-active");
    }
  }, [isActive]);

  return (
    <div className={styles.focusWrapper}>
      <button className={`${styles.toggleBtn} ${isActive ? styles.activeBtn : ""}`} onClick={toggleFocus}>
        🕶️ {isActive ? "Keluar Mode Fokus" : "Mode Fokus"}
      </button>

      {isActive && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.label}>Ukuran Teks:</span>
            <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className={styles.btn}>A-</button>
            <span className={styles.value}>{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className={styles.btn}>A+</button>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.label}>Font:</span>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className={styles.select}>
              <option value="sans">Geist Sans</option>
              <option value="serif">Georgia (Serif)</option>
              <option value="mono">Monospace</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.label}>Tema:</span>
            <button onClick={() => setTheme("light")} className={`${styles.themeBtn} ${styles.light} ${theme === 'light' ? styles.selectedTheme : ''}`}></button>
            <button onClick={() => setTheme("sepia")} className={`${styles.themeBtn} ${styles.sepia} ${theme === 'sepia' ? styles.selectedTheme : ''}`}></button>
            <button onClick={() => setTheme("dark")} className={`${styles.themeBtn} ${styles.dark} ${theme === 'dark' ? styles.selectedTheme : ''}`}></button>
          </div>

          {/* Inject styles dynamically into page */}
          <style jsx global>{`
            .focus-mode-active main {
              max-width: 800px !important;
            }
            .focus-mode-active aside {
              display: none !important;
            }
            .focus-mode-active article {
              background: ${theme === 'sepia' ? '#f4ecd8' : theme === 'dark' ? '#121212' : '#fff'} !important;
              color: ${theme === 'dark' ? '#e2e8f0' : '#1e293b'} !important;
              padding: 2rem !important;
              border-radius: 12px;
            }
            .focus-mode-active .bodyText {
              font-size: ${fontSize}px !important;
              font-family: ${fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'mono' ? 'monospace' : 'inherit'} !important;
              line-height: 1.8 !important;
            }
            .focus-mode-active header, .focus-mode-active .breadcrumb, .focus-mode-active footer {
              color: ${theme === 'dark' ? '#94a3b8' : '#64748b'} !important;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
