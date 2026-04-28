"use client";

import styles from "./BreakingNews.module.css";
import Link from "next/link";

export default function BreakingNews({ breakingNews = [] }) {
  if (!breakingNews || breakingNews.length === 0) return null;

  return (
    <div className={styles.breakingWrapper}>
      <div className={`container ${styles.breakingContainer}`}>
        <div className={styles.breakingBadge}>BREAKING NEWS</div>
        <div className={styles.tickerWrapper}>
          <div className={styles.ticker}>
            {breakingNews.map((news, idx) => (
              <span key={`1-${idx}`} className={styles.tickerItem}>
                <span className={styles.bullet}>•</span>
                <Link href={`/berita/baca?url=${encodeURIComponent(news.link || '')}`}>{news.title}</Link>
              </span>
            ))}
            {/* Duplicate for seamless scrolling loop */}
            {breakingNews.map((news, idx) => (
              <span key={`2-${idx}`} className={styles.tickerItem}>
                <span className={styles.bullet}>•</span>
                <Link href={`/berita/baca?url=${encodeURIComponent(news.link || '')}`}>{news.title}</Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
