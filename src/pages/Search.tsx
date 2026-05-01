"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import { searchBooks, getCoverUrl, OpenLibraryBook } from "@/services/openLibraryService";
import styles from "./Search.module.scss";

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

      if (filters.minYear) params.minYear = parseInt(filters.minYear);
      if (filters.maxYear) params.maxYear = parseInt(filters.maxYear);
      if (filters.language) params.language = filters.language;
      if (filters.author && type !== "author") params.author = filters.author;
      if (filters.sortBy) params.sort = filters.sortBy;

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
    <div className={styles.pageWrapper}>
      <div className={styles.inner}>
        <h1 className="text-3xl font-bold mb-6">Buscar Libros</h1>

        <div className={styles.searchSection}>
          <SearchBar onSearch={handleSearch} />
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>

        {loading && (
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
            <span>Cargando...</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button
              onClick={() => doSearch(currentQuery, currentType, page)}
              className="mt-2 ui-btn ui-btn--primary text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && !searchTriggered && (
          <div className={styles.emptyPrompt}>
            <h3 className="text-lg font-medium">Busca libros en nuestra biblioteca</h3>
            <p className="mt-2 text-sm">
              Usa la barra de búsqueda para encontrar libros por título, autor o tema.
            </p>
          </div>
        )}

        {!loading && !error && searchTriggered && (
          <>
            <p className={styles.resultsCount}>
              {totalResults.toLocaleString()} resultados encontrados
            </p>

            {results.length === 0 ? (
              <div className={styles.emptyPrompt}>
                <h3 className="mt-2 text-lg font-medium">No se encontraron resultados</h3>
                <p className="mt-1 text-sm">
                  Intenta con otros términos o cambia los filtros.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.resultsGrid}>
                  {results.map((book) => {
                    const workId = book.key.replace("/works/", "");
                    return (
                      <a key={book.key} href={`/libro/${workId}`} className={styles.bookCard}>
                        {book.cover_i ? (
                          <img
                            src={getCoverUrl(book.cover_i)}
                            alt={book.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className={styles.bookCoverPlaceholder}>
                            Sin portada
                          </div>
                        )}
                        <div className={styles.bookCardBody}>
                          <h3 className={styles.bookTitle}>{book.title}</h3>
                          {book.author_name && book.author_name.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {book.author_name[0]}
                            </p>
                          )}
                          <div className={styles.bookMeta}>
                            {book.first_publish_year && <span>{book.first_publish_year}</span>}
                            {book.edition_count && <span>{book.edition_count} ed.</span>}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="ui-btn ui-btn--ghost"
                    >
                      Anterior
                    </button>
                    <span className="px-4 py-2 text-sm">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="ui-btn ui-btn--ghost"
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
