import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import BreakingNews from "@/components/BreakingNews";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import { fetchRSS } from "./utils/fetchRSS";

export const metadata = {
  title: "Bazznews | Portal Berita Terkini & Canggih",
  description: "Dapatkan berita terbaru, terlengkap, dan terpercaya di Indonesia dengan pengalaman AI dan Voice Reader.",
};

export default async function RootLayout({ children }) {
  const cnnRes = await fetchRSS("cnn", "terbaru");
  const cnnNews = cnnRes.success ? cnnRes.data.slice(0, 5) : [];

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <ThemeProvider>
          <Header />
          <BreakingNews breakingNews={cnnNews} />
          <main className="container" style={{ flex: 1 }}>
            {children}
          </main>
          <footer style={{ textAlign: 'center', padding: '2rem', marginTop: '4rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <p>&copy; {new Date().getFullYear()} Bazznews. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
