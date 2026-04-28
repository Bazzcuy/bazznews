import NewsGrid from "@/components/NewsGrid";
import styles from "./page.module.css";
import { fetchRSS } from "@/app/utils/fetchRSS";

export const revalidate = 60;

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const { q } = params;
  return {
    title: q ? `Hasil Pencarian: "${q}" - Bazznews` : "Pencarian Berita - Bazznews",
    description: `Cari berita terkini dan terlengkap di Bazznews.`,
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const { q = "" } = params;

  let newsList = [];

  if (q.trim() !== "") {
    try {
      const cnnRes = await fetchRSS("cnn", "terbaru");
      const cnbcRes = await fetchRSS("cnbc", "terbaru");
      
      const allNews = [
        ...(cnnRes.success ? cnnRes.data.map(n => ({ ...n, provider: "CNN" })) : []),
        ...(cnbcRes.success ? cnbcRes.data.map(n => ({ ...n, provider: "CNBC" })) : [])
      ];

      // Filter by query
      const filtered = allNews.filter(item => 
        item.title.toLowerCase().includes(q.toLowerCase()) || 
        item.excerpt.toLowerCase().includes(q.toLowerCase())
      );

      newsList = filtered.map((n, i) => ({
        id: i + 1,
        title: n.title,
        excerpt: n.excerpt,
        category: n.provider,
        date: new Date(n.isoDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        image: n.image,
        link: n.link,
      }));
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cari Berita</h1>
        <p className={styles.description}>Temukan informasi hangat dan terpercaya.</p>
        
        <div className={styles.searchBarWrapper}>
          <form action="/search" method="GET" className={styles.searchForm}>
            <input 
              type="text" 
              name="q" 
              defaultValue={q} 
              className={styles.searchInput} 
              placeholder="Ketik kata kunci berita..." 
              required
            />
            <button type="submit" className={styles.searchBtn}>Cari</button>
          </form>
        </div>
      </header>

      {q.trim() === "" ? (
        <div className={styles.emptyState}>
          <p>Silakan masukkan kata kunci untuk mulai mencari berita.</p>
        </div>
      ) : newsList.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Tidak ada berita yang cocok dengan kata kunci "{q}".</p>
        </div>
      ) : (
        <NewsGrid newsList={newsList} />
      )}
    </div>
  );
}
