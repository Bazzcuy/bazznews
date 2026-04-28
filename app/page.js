import HeroCarousel from "@/components/HeroCarousel";
import NewsGrid from "@/components/NewsGrid";
import styles from "./page.module.css";
import { fetchRSS } from "./utils/fetchRSS";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  // Fetch CNN terbaru for headlines and cnbc terbaru for grid, or just all from one
  const cnnRes = await fetchRSS("cnn", "terbaru");
  const cnbcRes = await fetchRSS("cnbc", "terbaru");

  const cnnNews = cnnRes.success ? cnnRes.data : [];
  const cnbcNews = cnbcRes.success ? cnbcRes.data : [];

  // Use top 3 for carousel
  const headlines = cnnNews.slice(0, 3).map((n, i) => ({
    id: i + 1,
    title: n.title,
    category: "CNN Nasional",
    image: n.image,
    slug: n.slug,
  }));

  // Use next items for grid
  const newsList = cnbcNews.slice(0, 8).map((n, i) => ({
    id: i + 1,
    title: n.title,
    excerpt: n.excerpt,
    category: "CNBC Terbaru",
    date: new Date(n.isoDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    image: n.image,
    slug: n.slug,
  }));

  return (
    <>
      <HeroCarousel headlines={headlines} />
      <div className={styles.homeLayout}>
        <div className={styles.mainContent}>
          <NewsGrid newsList={newsList} />
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <h3 className={styles.sidebarTitle}>
              Populer
            </h3>
            <ul className={styles.popularList}>
              {cnnNews.slice(3, 8).map((item, index) => (
                <li key={index} className={styles.popularItem}>
                  <span className={styles.popularItemRank}>#{index + 1}</span>
                  <a href={`/berita/${item.slug}`} className={styles.popularItemLink}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className={styles.newsletterCard}>
              <h4 className={styles.newsletterTitle}>Newsletter</h4>
              <p className={styles.newsletterDesc}>
                Dapatkan update berita pilihan langsung ke inbox Anda.
              </p>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="Alamat Email" className={styles.newsletterInput} />
                <button type="button" className={styles.newsletterBtn}>
                  Langganan
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
