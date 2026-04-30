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
