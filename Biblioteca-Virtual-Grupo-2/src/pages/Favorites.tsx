import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../services/openLibraryService';
import { getFavorites, removeFromFavorites, addToFavorites } from '../utils/storage';
import BookCard from '../components/BookCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  const handleViewDetail = (book: Book) => {
    navigate(`/libro/${book.key.split('/').pop()}`);
  };

  const handleAddToFavorites = (book: Book) => {
    addToFavorites(book);
    loadFavorites();
  };

  const handleRemoveFromFavorites = (bookKey: string) => {
    removeFromFavorites(bookKey);
    loadFavorites();
  };

  const filteredFavorites = favorites.filter(book =>
    book.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">❤️ Mis Favoritos</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No tienes libros favoritos aún.</p>
          <button
            onClick={() => navigate('/buscar')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Buscar libros
          </button>
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Total de favoritos: <span className="font-bold text-lg">{favorites.length}</span>
              </p>
              <input
                type="text"
                placeholder="Filtrar por título..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No se encontraron favoritos con "{filter}"
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Mostrando {filteredFavorites.length} de {favorites.length} favoritos
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map((book) => (
                  <BookCard
                    key={book.key}
                    book={book}
                    onViewDetail={handleViewDetail}
                    onAddToFavorites={handleAddToFavorites}
                    onRemoveFromFavorites={handleRemoveFromFavorites}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
