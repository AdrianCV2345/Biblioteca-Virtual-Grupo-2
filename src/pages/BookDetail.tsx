'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBookDetail, getCoverUrl } from '../services/openLibraryService';
import { removeFromFavorites, isFavorite, toggleFavorite, FavoriteBook } from '../utils/storage';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import styles from './BookDetail.module.scss';

interface BookDetailProps {
  workId?: string;
}

export default function BookDetail({ workId }: BookDetailProps) {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const router = useRouter();

  const fetchBookDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookDetail(id);
      setBook(data);
      setIsFav(isFavorite(id));
    } catch (err) {
      setError('Error al cargar los detalles del libro. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workId) {
      fetchBookDetails(workId);
    }
  }, [workId]);

  const handleToggleFavorite = () => {
    if (!book) return;
    if (isFav) {
      removeFromFavorites(book.key);
      setIsFav(false);
    } else {
      const coverUrl = book.covers?.[0] ? getCoverUrl(book.covers[0]) : '';
      const favorite: FavoriteBook = {
        workId: book.key,
        title: book.title,
        coverUrl,
        authors: (book.authors ?? []).map((a: any) =>
          a.author?.key ? a.author.key.split('/').pop() : 'Desconocido'
        ),
        year: book.first_publish_date ?? '',
        description: typeof book.description === 'string'
          ? book.description
          : (book.description?.value ?? ''),
        subjects: (book.subjects ?? []).slice(0, 10),
        openLibraryUrl: `https://openlibrary.org${book.key}`,
      };
      toggleFavorite(favorite);
      setIsFav(true);
    }
  };

  const handleRetry = () => {
    if (workId) fetchBookDetails(workId);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;

  if (!book) {
    return (
      <div className={styles.notFound}>
        <div className="text-lg">Libro no encontrado</div>
      </div>
    );
  }

  const coverUrl = book.covers ? getCoverUrl(book.covers[0]) : '/placeholder-book.jpg';

  return (
    <div className={styles.pageWrapper}>
      <button onClick={() => router.back()} className={styles.backBtn}>
        ← Volver
      </button>

      <div className={styles.layout}>
        <div className="flex-shrink-0">
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            className={styles.cover}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
            }}
          />
        </div>

        <div className={styles.info}>
          <h1 className="text-4xl font-bold mb-4">{book.title}</h1>

          {book.authors && (
            <p className={styles.authors}>
              Autor: {book.authors.map((author: any) =>
                author.author?.key ? author.author.key.split('/').pop() : 'Desconocido'
              ).join(', ')}
            </p>
          )}

          {book.first_publish_date && (
            <p className={styles.publishDate}>
              Primera publicación: {book.first_publish_date}
            </p>
          )}

          {book.description && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700">
                {typeof book.description === 'string' ? book.description : book.description.value}
              </p>
            </div>
          )}

          {book.subjects && book.subjects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Temas</h2>
              <div className={styles.subjects}>
                {book.subjects.slice(0, 10).map((subject: string, index: number) => (
                  <span key={index} className={styles.subjectBadge}>{subject}</span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={handleToggleFavorite}
              className={`ui-btn ${isFav ? 'ui-btn--ghost' : 'ui-btn--primary'}`}
            >
              {isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </button>
            {book.key && (
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-btn ui-btn--ghost inline-flex items-center gap-2"
              >
                Ver en Open Library
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
