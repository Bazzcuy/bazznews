"use client";

import styles from "./BreakingNews.module.css";
import Link from "next/link";

export default function BreakingNews() {
  // Dummy breaking news data
  const breakingNews = [
    { id: 1, title: "IHSG Ditutup Menguat 1.2% Hari Ini", slug: "ihsg-menguat" },
    { id: 2, title: "Timnas Indonesia Lolos ke Putaran Final Piala Asia", slug: "timnas-lolos-piala-asia" },
    { id: 3, title: "Teknologi AI Terbaru Diperkenalkan di Jakarta Tech Week", slug: "teknologi-ai-terbaru" },
  ];

  return (
    <div className={styles.breakingWrapper}>
      <div className={`container ${styles.breakingContainer}`}>
        <div className={styles.breakingBadge}>BREAKING NEWS</div>
        <div className={styles.tickerWrapper}>
          <div className={styles.ticker}>
            {breakingNews.map((news) => (
              <span key={news.id} className={styles.tickerItem}>
                <span className={styles.bullet}>•</span>
                <Link href={`/berita/${news.slug}`}>{news.title}</Link>
              </span>
            ))}
            {/* Duplicate for seamless scrolling loop */}
            {breakingNews.map((news) => (
              <span key={`dup-${news.id}`} className={styles.tickerItem}>
                <span className={styles.bullet}>•</span>
                <Link href={`/berita/${news.slug}`}>{news.title}</Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
