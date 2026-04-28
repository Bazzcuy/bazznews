"use client";

import { useState, useEffect } from "react";
import styles from "./HeroCarousel.module.css";
import Link from "next/link";

export default function HeroCarousel({ headlines = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!headlines || headlines.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [headlines]);

  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselContainer}>
        {headlines.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.slide} ${
              index === currentIndex ? styles.slideActive : ""
            }`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className={styles.overlay}></div>
            <div className={styles.content}>
              <span className={styles.category}>{item.category}</span>
              <Link href={`/berita/baca?url=${encodeURIComponent(item.link || '')}`}>
                <h2 className={styles.title}>{item.title}</h2>
              </Link>
            </div>
          </div>
        ))}

        <div className={styles.indicators}>
          {headlines.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicatorBtn} ${
                index === currentIndex ? styles.indicatorActive : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
