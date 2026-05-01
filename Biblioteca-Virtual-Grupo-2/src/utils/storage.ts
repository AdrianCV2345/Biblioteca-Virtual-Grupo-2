import { Book } from '../services/openLibraryService';

const FAVORITES_KEY = 'biblioteca-favoritos';

export const getFavorites = (): Book[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const addToFavorites = (book: Book): void => {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    if (!favorites.find(fav => fav.key === book.key)) {
      favorites.push(book);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = (bookKey: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.key !== bookKey);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const isFavorite = (bookKey: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.key === bookKey);
};
