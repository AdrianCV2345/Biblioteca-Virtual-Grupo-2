'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getFavorites } from '../utils/storage';

export default function Navbar() {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavorites().length);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-40">
      <div className="ui-panel py-3">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold ui-kicker">
            Biblioteca Virtual
          </Link>

          <div className="flex items-center gap-2">
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
        </div>
      </div>
    </nav>
  );
}
