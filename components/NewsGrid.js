import styles from "./NewsGrid.module.css";
import Link from "next/link";
import Image from "next/image";

export default function NewsGrid({ newsList = [] }) {

  return (
    <section className={styles.gridSection}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>Berita Terkini</h3>
        <Link href="/berita" className={styles.viewAll}>
          Lihat Semua &rarr;
        </Link>
      </div>

      <div className={styles.grid}>
        {newsList.map((news) => (
          <article key={news.id} className={styles.card}>
            <Link href={`/berita/baca?url=${encodeURIComponent(news.link || '')}`} className={styles.imageWrapper}>
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${news.image})` }}
                aria-label={news.title}
              />
              <span className={styles.category}>{news.category}</span>
            </Link>
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.date}>{news.date}</span>
              </div>
              <Link href={`/berita/baca?url=${encodeURIComponent(news.link || '')}`}>
                <h4 className={styles.title}>{news.title}</h4>
              </Link>
              <p className={styles.excerpt}>{news.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
