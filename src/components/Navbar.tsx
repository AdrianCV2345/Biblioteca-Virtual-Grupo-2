'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

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
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/favoritos' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Favoritos
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
