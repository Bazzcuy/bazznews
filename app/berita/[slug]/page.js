import AISummary from "@/components/AISummary";
import VoiceReader from "@/components/VoiceReader";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

// Metadata dinamis untuk SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // Dalam skenario nyata, fetch data dari DB berdasarkan slug
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${title} - Bazznews`,
    description: `Baca berita selengkapnya tentang ${title} hanya di Bazznews.`,
    openGraph: {
      title: `${title} - Bazznews`,
      description: `Berita terkini: ${title}`,
      type: "article",
    }
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Konten artikel dummy
  const articleContent = `
    Pusat Inovasi Teknologi Asia Tenggara baru saja diresmikan di Jakarta oleh Presiden. Fasilitas megah ini diharapkan dapat menyerap lebih dari 10.000 tenaga kerja ahli di bidang kecerdasan buatan (AI) dan semikonduktor dalam lima tahun ke depan.
    
    Menurut menteri terkait, investasi awal untuk proyek ini diperkirakan mencapai Rp 15 Triliun, yang didukung oleh konsorsium perusahaan multinasional dan BUMN. Langkah ini merupakan bagian dari roadmap besar pemerintah untuk menjadikan Indonesia sebagai hub teknologi regional pada tahun 2030.
    
    Selain menjadi pusat penelitian, fasilitas ini juga dilengkapi dengan inkubator startup yang siap mendanai ide-ide brilian dari generasi muda. Diharapkan, kolaborasi antara akademisi, industri, dan pemerintah dapat melahirkan solusi inovatif untuk tantangan global masa depan.
  `;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">Beranda</Link> &gt; <Link href="/kategori/teknologi">Teknologi</Link>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta}>
          <span>Oleh: Redaksi Bazznews</span>
          <span>•</span>
          <span>27 April 2026</span>
          <span>•</span>
          <span>5 Menit Membaca</span>
        </div>
      </header>

      <div className={styles.heroImageWrapper}>
        <div 
          className={styles.heroImage}
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200)` }}
        />
        <p className={styles.caption}>Ilustrasi Pusat Inovasi Teknologi. (Sumber: Unsplash)</p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <AISummary articleText={articleContent} />
          <VoiceReader text={articleContent} />
          
          <div className={styles.bodyText}>
            {articleContent.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.tags}>
            <span className={styles.tagLabel}>Tag:</span>
            <Link href="/tag/teknologi" className={styles.tag}>Teknologi</Link>
            <Link href="/tag/ai" className={styles.tag}>AI</Link>
            <Link href="/tag/startup" className={styles.tag}>Startup</Link>
          </div>
        </div>
        
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Berita Terkait</h3>
          <ul className={styles.relatedList}>
            {[1, 2, 3].map((item) => (
              <li key={item} className={styles.relatedItem}>
                <Link href="#">
                  Perkembangan Startup AI di Indonesia Meningkat Tajam Tahun Ini
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
}
