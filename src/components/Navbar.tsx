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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Biblioteca Virtual
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/buscar"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/buscar' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Buscar
            </Link>
            <Link
              href="/favoritos"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/favoritos' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Favoritos
              {favCount > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-xs font-semibold leading-none text-white">
                  {favCount}
                </span>
              )}
            </Link>
            <Link
              href="/acerca"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/acerca' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Acerca
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
