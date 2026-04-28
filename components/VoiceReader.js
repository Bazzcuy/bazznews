"use client";

import { useState, useEffect } from "react";
import styles from "./VoiceReader.module.css";
import { StopIcon, VolumeIcon } from "./Icons";

export default function VoiceReader({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    } else {
      setIsSupported(false);
    }
  }, []);

  const togglePlay = () => {
    if (!speechSynthesis) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID"; // Indonesian
      
      utterance.onend = () => {
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  if (!isSupported) return null;

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.button} ${isPlaying ? styles.playing : ""}`}
        onClick={togglePlay}
        aria-label={isPlaying ? "Berhenti mendengarkan" : "Dengarkan artikel"}
      >
        <span className={styles.icon}>{isPlaying ? <StopIcon /> : <VolumeIcon />}</span>
        <span className={styles.text}>
          {isPlaying ? "Berhenti" : "Dengarkan Artikel"}
        </span>
        {isPlaying && (
          <div className={styles.waves}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </button>
    </div>
  );
}
