export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  edition_count?: number;
  cover_i?: number;
  [key: string]: any;
}

export interface SearchResult {
  docs: Book[];
  num_found: number;
}

export interface PaginatedResult {
  books: Book[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

export const searchBooks = async (query: string, page: number = 1, limit: number = 20): Promise<PaginatedResult> => {
  try {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const data: SearchResult = await response.json();
    const totalPages = Math.ceil(data.num_found / limit);
    
    return {
      books: data.docs,
      totalResults: data.num_found,
      currentPage: page,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M'): string => {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

export const getBookDetails = async (workId: string): Promise<any> => {
  try {
    const response = await fetch(`https://openlibrary.org/works/${workId}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};
