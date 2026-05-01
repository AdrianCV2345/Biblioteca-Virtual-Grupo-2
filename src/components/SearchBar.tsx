"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, searchType: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("general");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  }
let placeholder = "Buscar libros...";
  if (searchType === "title") placeholder = "Buscar por título...";
  if (searchType === "author") placeholder = "Buscar por autor...";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-3xl">
      <div className="flex-1 flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="general">Todo</option>
          <option value="title">Título</option>
          <option value="author">Autor</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
