'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, searchBooks } from '../services/openLibraryService';
import { addToFavorites, removeFromFavorites } from '../utils/storage';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import BookCard from '../components/BookCard';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchBooks = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await searchBooks('programming', page);
      setBooks(result.books);
      setTotalPages(result.totalPages);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Error al cargar los libros. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleViewDetail = (book: Book) => {
    router.push(`/libro/${book.key.split('/').pop()}`);
  };

  const handleAddToFavorites = (book: Book) => {
    addToFavorites(book);
  };

  const handleRemoveFromFavorites = (bookKey: string) => {
    removeFromFavorites(bookKey);
  };

  const handleRetry = () => {
    fetchBooks(currentPage);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (books.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No se encontraron libros.</p>
          <button
            onClick={() => router.push('/buscar')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ir a buscar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Biblioteca Virtual</h1>
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

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          ← Anterior
        </button>
        <span className="text-gray-700 font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
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
    </div>
  );
}
