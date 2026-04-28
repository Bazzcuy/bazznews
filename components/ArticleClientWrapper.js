"use client";

import { useState } from "react";
import AISummary from "./AISummary";
import VoiceReader from "./VoiceReader";
import NewsChat from "./NewsChat";
import AITranslator from "./AITranslator";
import Link from "next/link";
import styles from "../app/berita/baca/page.module.css";

export default function ArticleClientWrapper({ scrapedData, plainText }) {
  const { title, image, author, date, content, source } = scrapedData;
  const [displayContent, setDisplayContent] = useState(content);

  const handleTranslation = (translatedHtml) => {
    if (translatedHtml) {
      setDisplayContent(translatedHtml);
    } else {
      setDisplayContent(content); // Reset ke original
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.mainContent}>
        {/* Smart Tools Toolbar */}
        <div className={styles.toolsToolbar}>
          <AISummary articleText={plainText} />
          <VoiceReader text={plainText} />
          <AITranslator articleText={plainText} onTranslate={handleTranslation} />
        </div>

        <div 
          className={`${styles.bodyText} bodyText`}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />

        <div className={styles.tags}>
          <span className={styles.tagLabel}>Bazznews:</span>
          <Link href="/" className={styles.tag}>Terkini</Link>
          <Link href="/" className={styles.tag}>Nasional</Link>
        </div>

        <NewsChat articleText={plainText} />
      </div>
      
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Berita Terkait</h3>
        <ul className={styles.relatedList}>
          <li className={styles.relatedItem}>
            <Link href="/">
              Kembali ke Beranda untuk melihat berita lainnya.
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
