'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getFavorites } from '../utils/storage';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 'light');

  useEffect(() => {
    setFavCount(getFavorites().length);
  }, [pathname]);

  useEffect(() => {
    // initialize theme from localStorage or prefers-color-scheme
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved as 'light' | 'dark');
        document.documentElement.setAttribute('data-theme', saved);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {
      // ignore if storage not available
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    } catch (e) {}
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav className="sticky top-0 z-40">
      <div className="ui-panel py-3">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold ui-kicker">
            Biblioteca Virtual
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="ui-btn ui-btn--ghost text-sm"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-11.66l-.7.7M4.04 19.96l-.7-.7M21 12h-1M4 12H3m15.66 4.66l-.7-.7M4.04 4.04l-.7.7" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>
              )}
            </button>
            <Link
              href="/"
              className={`ui-btn ui-btn--ghost text-sm ${pathname === '/' ? 'ui-btn--primary' : ''}`}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Inicio
            </Link>

            <Link
              href="/buscar"
              className={`ui-btn ui-btn--ghost text-sm ${pathname === '/buscar' ? 'ui-btn--primary' : ''}`}
              aria-current={pathname === '/buscar' ? 'page' : undefined}
            >
              Buscar
            </Link>

            <Link
              href="/favoritos"
              className={`ui-btn ui-btn--ghost inline-flex items-center gap-2 text-sm ${pathname === '/favoritos' ? 'ui-btn--primary' : ''}`}
              aria-current={pathname === '/favoritos' ? 'page' : undefined}
            >
              Favoritos
              {favCount > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold leading-none text-white">
                  {favCount}
                </span>
              )}
            </Link>

            <Link
              href="/acerca"
              className={`ui-btn ui-btn--ghost text-sm ${pathname === '/acerca' ? 'ui-btn--primary' : ''}`}
              aria-current={pathname === '/acerca' ? 'page' : undefined}
            >
              Acerca
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className={`ui-btn ui-btn--ghost ${styles.mobileOnly}`}
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className={`ui-btn ui-btn--ghost ${styles.mobileOnly}`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-11.66l-.7.7M4.04 19.96l-.7-.7M21 12h-1M4 12H3m15.66 4.66l-.7-.7M4.04 4.04l-.7.7" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-over */}
      <div className={`${styles.mobileNavBackdrop} ${open ? styles.isOpen : ''}`} onClick={() => setOpen(false)} />
      <aside className={`${styles.mobileNavPanel} ${open ? styles.isOpen : ''}`} aria-hidden={!open}>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Navegación</h3>
          <button className={`ui-btn ui-btn--ghost ${styles.mobileNavClose}`} onClick={() => setOpen(false)} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className={styles.mobileNavLinks} onClick={() => setOpen(false)}>
          <Link href="/" className="ui-btn ui-btn--ghost">Inicio</Link>
          <Link href="/buscar" className="ui-btn ui-btn--ghost">Buscar</Link>
          <Link href="/favoritos" className="ui-btn ui-btn--ghost">Favoritos</Link>
          <Link href="/acerca" className="ui-btn ui-btn--ghost">Acerca</Link>
        </nav>
      </aside>
    </nav>
  );
}
