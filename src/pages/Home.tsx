'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, searchBooks } from '../services/openLibraryService';
import { addToFavorites, removeFromFavorites } from '../utils/storage';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import BookCard from '../components/BookCard';
import styles from './Home.module.scss';

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
      <div className={styles.emptyState}>
        <p className="text-xl text-gray-600 mb-4">No se encontraron libros.</p>
        <button
          onClick={() => router.push('/buscar')}
          className="ui-btn ui-btn--primary"
        >
          Ir a buscar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <p className="ui-kicker">Explora</p>
        <h1 className="text-3xl font-bold">Biblioteca Virtual</h1>
        <p className="text-sm text-gray-600 mt-2">Descubre libros populares y guarda tus favoritos</p>
      </header>

      <section className={styles.bookGrid}>
        {books.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            onViewDetail={handleViewDetail}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        ))}
      </section>

      <div className={`${styles.pagination} ui-pagination`}>
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className={`ui-btn ${currentPage === 1 ? 'ui-btn--ghost opacity-50 cursor-not-allowed' : 'ui-btn--ghost ui-btn--primary'}`}
        >
          ← Anterior
        </button>
        <span className="text-gray-700 font-medium">Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className={`ui-btn ${currentPage === totalPages ? 'ui-btn--ghost opacity-50 cursor-not-allowed' : 'ui-btn--ghost ui-btn--primary'}`}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
