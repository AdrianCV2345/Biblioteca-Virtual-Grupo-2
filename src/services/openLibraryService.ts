const BASE_URL = "https://openlibrary.org";


export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  first_publish_year?: number;
  publish_year?: number[];
  number_of_pages_median?: number;
  edition_count?: number;
  isbn?: string[];
  language?: string[];
  subject?: string[];
  publisher?: string[];
  publish_date?: string[];
  ebook_access?: string;
  public_scan_b?: boolean;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}

export interface SearchParams {
  q?: string;
  title?: string;
  author?: string;
  minYear?: number;
  maxYear?: number;
  language?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}
export async function searchBooks(params: SearchParams): Promise<OpenLibrarySearchResponse> {
  const queryConfig = [
    { name: "q", value: params.q },
    { name: "title", value: params.title },
    { name: "author", value: params.author },
    { name: "publish_year_min", value: params.minYear },
    { name: "publish_year_max", value: params.maxYear },
    { name: "language", value: params.language },
    { name: "sort", value: params.sort },
    { name: "limit", value: params.limit },
    { name: "offset", value: params.offset },
  ];
  let parts: string[] = [];
  queryConfig.forEach((item) => {
    if (item.value !== undefined && item.value !== "") {
      parts.push(`${item.name}=${encodeURIComponent(String(item.value))}`);
    }
  });
  if (!params.q && !params.title && !params.author) {
    parts.push("q=");
  }
  const url = `${BASE_URL}/search.json?${parts.join("&")}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al buscar libros: " + response.statusText);
  }
  return response.json();
}

export async function searchByTitle(title: string, extra?: Omit<SearchParams, "title">): Promise<OpenLibrarySearchResponse> {
  return searchBooks({ title, ...extra });
}

export async function searchByAuthor(author: string, extra?: Omit<SearchParams, "author">): Promise<OpenLibrarySearchResponse> {
  return searchBooks({ author, ...extra });
}

export async function getBookDetail(workId: string) {
  const response = await fetch(`${BASE_URL}/works/${workId}.json`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export function getCoverUrl(coverId: number | undefined, size: string = "M"): string {
  if (!coverId) return "";
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}


export function getWorkIdFromKey(key: string): string {
  return key.replace("/works/", "");
}