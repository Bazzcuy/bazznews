import NewsGrid from "@/components/NewsGrid";
import styles from "./page.module.css";
import { fetchRSS } from "@/app/utils/fetchRSS";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `Kategori ${categoryName} - Bazznews`,
    description: `Daftar berita terbaru kategori ${categoryName} di Bazznews.`,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;

  // Map category to valid provider/category
  let provider = "cnn";
  let apiCategory = category;

  if (category === "bisnis") {
    apiCategory = "ekonomi";
  } else if (category === "nasional") {
    apiCategory = "nasional";
  } else if (category === "teknologi") {
    apiCategory = "teknologi";
  } else if (category === "olahraga") {
    apiCategory = "olahraga";
  } else if (category === "hiburan") {
    apiCategory = "hiburan";
  } else {
    apiCategory = "terbaru";
  }

  const res = await fetchRSS(provider, apiCategory);
  const news = res.success ? res.data : [];

  const newsList = news.map((n, i) => ({
    id: i + 1,
    title: n.title,
    excerpt: n.excerpt,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    date: new Date(n.isoDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    image: n.image,
    link: n.link,
  }));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Berita {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
        <p className={styles.description}>Menampilkan berita terkini dan terlengkap.</p>
      </header>

      {newsList.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Tidak ada berita yang ditemukan untuk kategori ini.</p>
        </div>
      ) : (
        <NewsGrid newsList={newsList} />
      )}
    </div>
  );
}
