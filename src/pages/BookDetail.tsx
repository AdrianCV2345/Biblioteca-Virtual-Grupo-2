'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBookDetail, getCoverUrl } from '../services/openLibraryService';
import { addToFavorites } from '../utils/storage';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

interface BookDetailProps {
  workId?: string;
}

export default function BookDetail({ workId }: BookDetailProps) {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBookDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookDetail(id);
      setBook(data);
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

  const handleAddToFavorites = () => {
    if (!book) return;
    addToFavorites({
      key: book.key,
      title: book.title,
      cover_i: book.covers?.[0],
      first_publish_year: book.first_publish_date ? parseInt(book.first_publish_date) : undefined,
    });
  };

  const handleRetry = () => {
    if (workId) {
      fetchBookDetails(workId);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Libro no encontrado</div>
      </div>
    );
  }

  const coverUrl = book.covers ? getCoverUrl(book.covers[0]) : '/placeholder-book.jpg';

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        ← Volver
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            className="object-cover rounded shadow-lg w-80 h-96"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
            }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
          {book.authors && (
            <p className="text-xl text-gray-600 mb-4">
              Autor: {book.authors.map((author: any) => author.author?.key ? author.author.key.split('/').pop() : 'Desconocido').join(', ')}
            </p>
          )}
          {book.first_publish_date && (
            <p className="text-lg text-gray-600 mb-4">
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
              <div className="flex flex-wrap gap-2">
                {book.subjects.slice(0, 10).map((subject: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={handleAddToFavorites}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Agregar a favoritos
            </button>
            {book.key && (
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
              >
                Ver en Open Library
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
