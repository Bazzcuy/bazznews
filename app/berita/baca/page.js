import ArticleClientWrapper from "@/components/ArticleClientWrapper";
import AISummary from "@/components/AISummary";
import VoiceReader from "@/components/VoiceReader";
import Link from "next/link";
import styles from "./page.module.css";
import { scrapeArticle } from "@/app/utils/scrapeArticle";

export const revalidate = 3600; // Cache 1 hour

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const { url } = params;
  if (!url) return { title: "Berita Tidak Ditemukan - Bazznews" };

  const scraped = await scrapeArticle(url);
  const title = scraped.success ? scraped.data.title : "Baca Berita";
  
  return {
    title: `${title} - Bazznews`,
    description: `Baca berita selengkapnya tentang ${title} hanya di Bazznews.`,
    openGraph: {
      title: `${title} - Bazznews`,
      type: "article",
    }
  };
}

export default async function ReadPage({ searchParams }) {
  const params = await searchParams;
  const { url } = params;
  
  if (!url) {
    return (
      <div className={styles.errorContainer}>
        <h2>URL berita tidak ditemukan.</h2>
        <Link href="/">Kembali ke Beranda</Link>
      </div>
    );
  }

  const scraped = await scrapeArticle(url);

  if (!scraped.success || !scraped.data) {
    return (
      <div className={styles.errorContainer}>
        <h2>Gagal memuat isi berita.</h2>
        <p>{scraped.message}</p>
        <Link href="/">Kembali ke Beranda</Link>
      </div>
    );
  }

  const { title, image, author, date, content, source } = scraped.data;

  // Plain text for AI Summary and Voice Reader
  const plainText = content.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">Beranda</Link> &gt; <Link href="#">Berita Terbaru</Link>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta}>
          <span>Oleh: {author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </header>

      <div className={styles.heroImageWrapper}>
        <div 
          className={styles.heroImage}
          style={{ backgroundImage: `url(${image})` }}
        />
        <p className={styles.caption}>Sumber: <a href={source} target="_blank" rel="noreferrer" className={styles.sourceLink}>Berita Asli</a></p>
      </div>

      <ArticleClientWrapper scrapedData={scraped.data} plainText={plainText} />
    </article>
  );
}
