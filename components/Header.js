"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import styles from "./Header.module.css";
import { useState } from "react";
import { MoonIcon, SunIcon, CloseIcon, MenuIcon } from "./Icons";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Nasional", path: "/kategori/nasional" },
    { name: "Bisnis", path: "/kategori/bisnis" },
    { name: "Teknologi", path: "/kategori/teknologi" },
    { name: "Olahraga", path: "/kategori/olahraga" },
    { name: "Hiburan", path: "/kategori/hiburan" },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          Bazz<span>news</span>
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          {/* Mobile Search */}
          <form action="/search" method="GET" className={styles.mobileSearchForm}>
            <input type="text" name="q" placeholder="Cari berita..." className={styles.mobileSearchInput} required />
            <button type="submit" className={styles.mobileSearchBtn}>Cari</button>
          </form>

          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {/* Desktop Search */}
          <form action="/search" method="GET" className={styles.searchForm}>
            <input type="text" name="q" placeholder="Cari..." className={styles.searchInput} required />
            <button type="submit" className={styles.searchBtn} aria-label="Cari Berita">
              <SearchIcon />
            </button>
          </form>

          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
