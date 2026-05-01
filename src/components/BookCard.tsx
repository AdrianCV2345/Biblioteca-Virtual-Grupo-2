'use client';

import { useState, useEffect } from 'react';
import { Book, getCoverUrl } from '../services/openLibraryService';
import { addToFavorites, removeFromFavorites, isFavorite as checkIsFavorite } from '../utils/storage';
import styles from './BookCard.module.scss';

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
    <article className={`${styles.bookCard} ui-enter relative`}>
      <img
        src={coverUrl}
        alt={`Cover of ${book.title}`}
        className={styles.cover}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-book.jpg';
        }}
      />

      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={isFav}
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

      <div className={styles.body}>
        <h3 className={`${styles.title} line-clamp-2`}>{book.title}</h3>
        <p className={styles.meta}>Autor: {book.author_name ? book.author_name.join(', ') : 'Desconocido'}</p>
        <p className={styles.meta}>Año: {book.first_publish_year || 'Desconocido'}</p>
        <p className={styles.meta}>Ediciones: {book.edition_count || 'Desconocido'}</p>

        <div className={styles.actions}>
          <button onClick={() => onViewDetail(book)} className="ui-btn ui-btn--ghost flex-1">Ver detalle</button>
          <button onClick={handleFavoriteClick} className={`ui-btn ${isFav ? 'ui-btn--primary' : 'ui-btn--ghost'} flex-1`}> {isFav ? 'Favorito' : 'Agregar'}</button>
        </div>
      </div>
    </article>
  );
}
