"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import { searchBooks, getCoverUrl, OpenLibraryBook } from "@/services/openLibraryService";

interface FilterOptions {
  minYear: string;
  maxYear: string;
  language: string;
  author: string;
  sortBy: string;
}

export default function SearchPage() {
  const [results, setResults] = useState<OpenLibraryBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const [currentQuery, setCurrentQuery] = useState("");
  const [currentType, setCurrentType] = useState("general");

  const [filters, setFilters] = useState<FilterOptions>({
    minYear: "",
    maxYear: "",
    language: "",
    author: "",
    sortBy: "",
  });
async function doSearch(query: string, type: string, pageNum: number) {
    setLoading(true);
    setError(null);

    try {
      const offset = (pageNum - 1) * 20;

      let params: any = { limit: 20, offset };

      if (type === "title") {
        params.title = query;
      } else if (type === "author") {
        params.author = query;
      } else {
        params.q = query;
      }

      if (filters.minYear) {
        params.minYear = parseInt(filters.minYear);
      }
      if (filters.maxYear) {
        params.maxYear = parseInt(filters.maxYear);
      }
      if (filters.language) {
        params.language = filters.language;
      }
      if (filters.author && type !== "author") {
        params.author = filters.author;
      }
      if (filters.sortBy) {
        params.sort = filters.sortBy;
      }

      const response = await searchBooks(params);

      setResults(response.books);
      setTotalResults(response.totalResults);
      setSearchTriggered(true);
    } catch (err: any) {
      setError(err.message || "Error al buscar libros");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }
   function handleSearch(query: string, type: string) {
    setCurrentQuery(query);
    setCurrentType(type);
    setPage(1);
    doSearch(query, type, 1);
  }

    function handleFilterChange(newFilters: FilterOptions) {
    setFilters(newFilters);
    if (currentQuery) {
      doSearch(currentQuery, currentType, 1);
      setPage(1);
    }
  }

    function handlePageChange(newPage: number) {
    setPage(newPage);
    doSearch(currentQuery, currentType, newPage);
    window.scrollTo({ top: 0 });
  }  
  const totalPages = Math.ceil(totalResults / 20);

   return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Buscar Libros
        </h1>

        <div className="mb-6 space-y-4">
          <SearchBar onSearch={handleSearch} />
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => doSearch(currentQuery, currentType, page)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && !searchTriggered && (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Busca libros en nuestra biblioteca
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Usa la barra de búsqueda para encontrar libros por título, autor o tema.
            </p>
          </div>
        )}

        {!loading && !error && searchTriggered && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {totalResults.toLocaleString()} resultados encontrados
            </p>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  No se encontraron resultados
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Intenta con otros términos o cambia los filtros.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((book) => {
                    const workId = book.key.replace("/works/", "");
                    return (
                      <a
                        key={book.key}
                        href={`/libro/${workId}`}
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        {book.cover_i ? (
                          <img
                            src={getCoverUrl(book.cover_i)}
                            alt={book.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Sin portada</span>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {book.title}
                          </h3>
                          {book.author_name && book.author_name.length > 0 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                              {book.author_name[0]}
                            </p>
                          )}
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            {book.first_publish_year && (
                              <span>{book.first_publish_year}</span>
                            )}
                            {book.edition_count && (
                              <span>{book.edition_count} ed.</span>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>

              
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>

                    <span className="px-4 py-2 text-sm">
                      Página {page} de {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );


}
