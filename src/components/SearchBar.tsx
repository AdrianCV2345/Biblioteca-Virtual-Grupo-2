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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-3xl ui-enter">
      <div className="flex-1 flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="ui-select px-3 py-2"
          aria-label="Tipo de búsqueda"
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
          className="flex-1 ui-input px-4 py-2"
          aria-label="Buscar libros"
        />
      </div>
      <button
        type="submit"
        className="ui-btn ui-btn--primary"
        aria-label="Buscar"
      >
        Buscar
      </button>
    </form>
  );
}
