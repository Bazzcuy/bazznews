"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import styles from "./Header.module.css";
import { useState } from "react";
import { MoonIcon, SunIcon, CloseIcon, MenuIcon } from "./Icons";

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
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} className={styles.navLink}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
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
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
