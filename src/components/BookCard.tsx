'use client';

import { useState, useEffect } from 'react';
import { Book, getCoverUrl } from '../services/openLibraryService';
import { addToFavorites, removeFromFavorites, isFavorite as checkIsFavorite } from '../utils/storage';

interface BookCardProps {
  book: Book;
  onViewDetail: (book: Book) => void;
  onAddToFavorites: (book: Book) => void;
  onRemoveFromFavorites?: (bookKey: string) => void;
}

export default function BookCard({
  book,
  onViewDetail,
  onAddToFavorites,
  onRemoveFromFavorites
}: BookCardProps) {
  const [isFav, setIsFav] = useState(false);
  const coverUrl = book.cover_i ? getCoverUrl(book.cover_i) : '/placeholder-book.jpg';

  useEffect(() => {
    const favoriteStatus = checkIsFavorite(book.key);
    setIsFav(favoriteStatus);
  }, [book.key]);

  const handleFavoriteClick = () => {
    if (isFav) {
      if (onRemoveFromFavorites) {
        removeFromFavorites(book.key);
        onRemoveFromFavorites(book.key);
      }
      setIsFav(false);
    } else {
      addToFavorites(book);
      onAddToFavorites(book);
      setIsFav(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative">
      <div className="aspect-w-3 aspect-h-4 mb-4">
        <img
          src={coverUrl}
          alt={`Cover of ${book.title}`}
          className="object-cover rounded w-full h-64"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
          }}
        />
      </div>
      {/* Favorite icon - top right corner */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <svg
          className={`w-6 h-6 ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          fill={isFav ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
      <p className="text-gray-600 mb-1">
        Autor: {book.author_name ? book.author_name.join(', ') : 'Desconocido'}
      </p>
      <p className="text-gray-600 mb-1">
        Año: {book.first_publish_year || 'Desconocido'}
      </p>
      <p className="text-gray-600 mb-4">
        Ediciones: {book.edition_count || 'Desconocido'}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetail(book)}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Ver detalle
        </button>
        <button
          onClick={handleFavoriteClick}
          className={`flex-1 text-white px-4 py-2 rounded transition-colors ${
            isFav
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isFav ? '❤️ Favorito' : '🤍 Agregar'}
        </button>
      </div>
    </div>
  );
}
