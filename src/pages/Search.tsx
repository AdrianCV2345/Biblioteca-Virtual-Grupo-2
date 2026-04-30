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

      setResults(response.docs);
      setTotalResults(response.numFound);
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

}
