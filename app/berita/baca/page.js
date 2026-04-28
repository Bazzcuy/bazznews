import ArticleClientWrapper from "@/components/ArticleClientWrapper";
import Link from "next/link";
import styles from "./page.module.css";
import { scrapeArticle } from "@/app/utils/scrapeArticle";
import { fetchRSS } from "@/app/utils/fetchRSS";

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

  // Fetch related news
  let relatedNews = [];
  try {
    const cnnRes = await fetchRSS("cnn", "terbaru");
    const cnbcRes = await fetchRSS("cnbc", "terbaru");
    const allNews = [...(cnnRes.success ? cnnRes.data : []), ...(cnbcRes.success ? cnbcRes.data : [])];

    // Extract keywords from title (words > 3 chars)
    const keywords = title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Filter related news (excluding the current one by link)
    relatedNews = allNews.filter(item => {
      if (item.link === url) return false;
      const itemTitleLower = item.title.toLowerCase();
      return keywords.some(keyword => itemTitleLower.includes(keyword));
    }).slice(0, 5); // Top 5
  } catch (error) {
    console.error("Failed to fetch related news:", error);
  }

  // Plain text for AI Summary and Voice Reader
  const plainText = content.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();

  // Extract source name from URL
  let sourceName = "Berita Asli";
  try {
    const sourceUrl = new URL(source);
    sourceName = sourceUrl.hostname.replace('www.', '');
    if (sourceName.includes('cnnindonesia')) sourceName = "CNN Indonesia";
    if (sourceName.includes('cnbcindonesia')) sourceName = "CNBC Indonesia";
  } catch (e) {}

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">Beranda</Link> &gt; <Link href="#">Berita Terbaru</Link>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta}>
          <span>Oleh: {author || sourceName}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </header>

      <div className={styles.heroImageWrapper}>
        <div 
          className={styles.heroImage}
          style={{ backgroundImage: `url(${image})` }}
        />
        <p className={styles.caption}>Sumber Gambar & Konten: <a href={source} target="_blank" rel="noreferrer" className={styles.sourceLink}>{sourceName}</a></p>
      </div>

      <ArticleClientWrapper scrapedData={scraped.data} plainText={plainText} relatedNews={relatedNews} />
    </article>
  );
}
