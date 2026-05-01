import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, searchBooks } from '../services/openLibraryService';
import { addToFavorites, removeFromFavorites } from '../utils/storage';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';

export default function Search() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minYear, setMinYear] = useState<string>('');
  const [maxYear, setMaxYear] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const navigate = useNavigate();

  const fetchBooks = async (query: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      let searchUrl = query;

      // Add year filters
      if (minYear) {
        searchUrl += ` first_publish_year:[${minYear} TO *]`;
      }
      if (maxYear) {
        searchUrl += ` first_publish_year:[* TO ${maxYear}]`;
      }

      // Add language filter
      if (language) {
        searchUrl += ` language:${language}`;
      }

      const result = await searchBooks(searchUrl, page);
      setBooks(result.books);
      setTotalPages(result.totalPages);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Error al buscar libros. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchBooks(searchQuery, currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage, minYear, maxYear, language]);

  const handleRetry = () => {
    if (searchQuery) {
      fetchBooks(searchQuery, currentPage);
    }
  };

  const handleViewDetail = (book: Book) => {
    navigate(`/libro/${book.key.split('/').pop()}`);
  };

  const handleAddToFavorites = (book: Book) => {
    addToFavorites(book);
    console.log('Added to favorites:', book.title);
  };

  const handleRemoveFromFavorites = (bookKey: string) => {
    removeFromFavorites(bookKey);
    console.log('Removed from favorites');
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Buscar Libros</h1>
      <SearchBar onSearch={handleSearch} />

      {/* Advanced Filters */}
      {searchQuery && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtros Avanzados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año Mínimo
              </label>
              <input
                type="number"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                placeholder="p.ej. 1990"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año Máximo
              </label>
              <input
                type="number"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                placeholder="p.ej. 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los idiomas</option>
                <option value="eng">Inglés</option>
                <option value="spa">Español</option>
                <option value="fra">Francés</option>
                <option value="deu">Alemán</option>
                <option value="ita">Italiano</option>
                <option value="por">Portugués</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleApplyFilters}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      )}

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={handleRetry} />}
      {!loading && !error && books.length === 0 && searchQuery && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">
              No se encontraron libros para "{searchQuery}".
            </p>
            <p className="text-gray-500">Intenta con otra búsqueda o ajusta los filtros.</p>
          </div>
        </div>
      )}
      {!loading && !error && books.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {books.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                onViewDetail={handleViewDetail}
                onAddToFavorites={handleAddToFavorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              ← Anterior
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">
                Página {currentPage} de {totalPages}
              </span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
