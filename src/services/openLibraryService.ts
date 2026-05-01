const BASE_URL = "https://openlibrary.org";

// --- Interfaces Detalladas (de Master) ---
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

export interface PaginatedResult {
  books: OpenLibraryBook[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
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
  page?: number; // Añadido para compatibilidad
}

export async function searchBooks(params: SearchParams | string, page: number = 1, limit: number = 20): Promise<PaginatedResult> {
  let urlParams: SearchParams;

  // Manejar si pasan un string (como hacía tu compañera) o un objeto (como en master)
  if (typeof params === 'string') {
    urlParams = { q: params, limit, offset: (page - 1) * limit };
  } else {
    urlParams = { 
      ...params, 
      limit: params.limit || limit, 
      offset: params.offset || (page - 1) * (params.limit || limit) 
    };
  }

  const queryConfig = [
    { name: "q", value: urlParams.q },
    { name: "title", value: urlParams.title },
    { name: "author", value: urlParams.author },
    { name: "publish_year_min", value: urlParams.minYear },
    { name: "publish_year_max", value: urlParams.maxYear },
    { name: "language", value: urlParams.language },
    { name: "sort", value: urlParams.sort },
    { name: "limit", value: urlParams.limit },
    { name: "offset", value: urlParams.offset },
  ];

  let parts: string[] = [];
  queryConfig.forEach((item) => {
    if (item.value !== undefined && item.value !== "") {
      parts.push(`${item.name}=${encodeURIComponent(String(item.value))}`);
    }
  });

  if (!urlParams.q && !urlParams.title && !urlParams.author) {
    parts.push("q=");
  }

  const response = await fetch(`${BASE_URL}/search.json?${parts.join("&")}`);
  
  if (!response.ok) {
    throw new Error("Error al buscar libros: " + response.statusText);
  }

  const data: OpenLibrarySearchResponse = await response.json();
  
  // Retornamos el formato paginado que espera el componente de tu compañera
  return {
    books: data.docs,
    totalResults: data.numFound,
    currentPage: page,
    totalPages: Math.ceil(data.numFound / (urlParams.limit || 20)),
  };
}

export async function getBookDetail(workId: string) {
  const response = await fetch(`${BASE_URL}/works/${workId}.json`);
  if (!response.ok) return null;
  return response.json();
}

export function getCoverUrl(coverId: number | undefined, size: string = "M"): string {
  if (!coverId) return "";
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getWorkIdFromKey(key: string): string {
  return key.replace("/works/", "");
}

export type Book = OpenLibraryBook;
export const getBookDetails = getBookDetail;