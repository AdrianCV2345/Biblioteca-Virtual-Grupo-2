'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getFavorites } from '../utils/storage';

export default function Navbar() {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFavCount(getFavorites().length);
  }, [pathname]);

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
              className="ui-btn ui-btn--ghost mobile-only"
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-over */}
      <div className={`mobile-nav-backdrop ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`mobile-nav-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Navegación</h3>
          <button className="ui-btn ui-btn--ghost mobile-nav-close" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className="mobile-nav-links" onClick={() => setOpen(false)}>
          <Link href="/" className="ui-btn ui-btn--ghost">Inicio</Link>
          <Link href="/buscar" className="ui-btn ui-btn--ghost">Buscar</Link>
          <Link href="/favoritos" className="ui-btn ui-btn--ghost">Favoritos</Link>
          <Link href="/acerca" className="ui-btn ui-btn--ghost">Acerca</Link>
        </nav>
      </aside>
    </nav>
  );
}
