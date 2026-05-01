import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Biblioteca Virtual
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/buscar"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/buscar' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Buscar
            </Link>
            <Link
              to="/favoritos"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/favoritos' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Favoritos
            </Link>
            <Link
              to="/acerca"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/acerca' ? 'bg-blue-700' : 'hover:bg-blue-700'
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
