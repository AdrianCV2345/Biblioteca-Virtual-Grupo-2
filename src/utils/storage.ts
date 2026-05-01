export interface FavoriteBook {
	workId: string;
	title: string;
	coverUrl: string;
	authors: string[];
	year: string;
	description: string;
	subjects: string[];
	openLibraryUrl: string;
}

const FAVORITES_STORAGE_KEY = "biblioteca-virtual:favorites";

function canUseStorage() {
	return typeof window !== "undefined";
}

export function getFavorites(): FavoriteBook[] {
	if (!canUseStorage()) {
		return [];
	}

	try {
		const rawFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
		if (!rawFavorites) {
			return [];
		}

		const parsedFavorites = JSON.parse(rawFavorites);
		return Array.isArray(parsedFavorites) ? parsedFavorites : [];
	} catch {
		return [];
	}
}

export function saveFavorites(favorites: FavoriteBook[]) {
	if (!canUseStorage()) {
		return;
	}

	window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(workId: string): boolean {
	return getFavorites().some((favorite) => favorite.workId === workId);
}

interface BookInput {
	key: string;
	title: string;
	author_name?: string[];
	cover_i?: number;
	first_publish_year?: number;
}

export function addToFavorites(book: BookInput): void {
	if (!canUseStorage()) return;
	const favorites = getFavorites();
	if (favorites.some((f) => f.workId === book.key)) return;
	const favorite: FavoriteBook = {
		workId: book.key,
		title: book.title,
		coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "",
		authors: book.author_name || [],
		year: book.first_publish_year?.toString() || "",
		description: "",
		subjects: [],
		openLibraryUrl: `https://openlibrary.org${book.key}`,
	};
	favorites.unshift(favorite);
	saveFavorites(favorites);
}

export function removeFromFavorites(bookKey: string): void {
	if (!canUseStorage()) return;
	saveFavorites(getFavorites().filter((f) => f.workId !== bookKey));
}

export function toggleFavorite(book: FavoriteBook): boolean {
	const favorites = getFavorites();
	const existingIndex = favorites.findIndex((favorite) => favorite.workId === book.workId);

	if (existingIndex >= 0) {
		favorites.splice(existingIndex, 1);
		saveFavorites(favorites);
		return false;
	}

	favorites.unshift(book);
	saveFavorites(favorites);
	return true;
}
