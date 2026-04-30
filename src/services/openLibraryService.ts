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