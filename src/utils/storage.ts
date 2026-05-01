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
				if (!Array.isArray(parsedFavorites)) return [];
				// Normalize any legacy entries to ensure workId is the raw id (no '/works/' prefix)
				return parsedFavorites.map((f: any) => ({
					...f,
					workId: normalizeWorkId(f.workId || f.workId),
					openLibraryUrl: f.openLibraryUrl || `https://openlibrary.org/works/${normalizeWorkId(f.workId)}`,
				}));
	} catch {
		return [];
	}
}

function normalizeWorkId(id: string) {
	if (!id) return "";
	return id.replace(/^\/?works\//, "");
}

export function saveFavorites(favorites: FavoriteBook[]) {
	if (!canUseStorage()) {
		return;
	}

	window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(workId: string): boolean {
	const normalized = normalizeWorkId(workId);
	return getFavorites().some((favorite) => normalizeWorkId(favorite.workId) === normalized);
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
		const normalized = normalizeWorkId(book.key);
		if (favorites.some((f) => normalizeWorkId(f.workId) === normalized)) return;
		const favorite: FavoriteBook = {
				workId: normalized,
		title: book.title,
		coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "",
		authors: book.author_name || [],
		year: book.first_publish_year?.toString() || "",
		description: "",
		subjects: [],
			openLibraryUrl: `https://openlibrary.org/works/${normalized}`,
	};
	favorites.unshift(favorite);
	saveFavorites(favorites);
}

export function removeFromFavorites(bookKey: string): void {
	if (!canUseStorage()) return;
	const normalized = normalizeWorkId(bookKey);
	saveFavorites(getFavorites().filter((f) => normalizeWorkId(f.workId) !== normalized));
}

export const removeFavorite = removeFromFavorites;

export function toggleFavorite(book: FavoriteBook): boolean {
	const favorites = getFavorites();
	const normalized = normalizeWorkId(book.workId);
	const existingIndex = favorites.findIndex((favorite) => normalizeWorkId(favorite.workId) === normalized);

	if (existingIndex >= 0) {
		favorites.splice(existingIndex, 1);
		saveFavorites(favorites);
		return false;
	}

	// ensure stored workId is normalized
	const toStore = { ...book, workId: normalized };
	favorites.unshift(toStore);
	saveFavorites(favorites);
	return true;
}
