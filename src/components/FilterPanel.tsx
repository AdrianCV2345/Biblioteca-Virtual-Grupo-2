"use client";

import { useState } from "react";

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  minYear: string;
  maxYear: string;
  language: string;
  author: string;
  sortBy: string;
}

const LANGUAGES = [
  { value: "", label: "Todos los idiomas" },
  { value: "eng", label: "Inglés" },
  { value: "spa", label: "Español" },
  { value: "fre", label: "Francés" },
  { value: "ger", label: "Alemán" },
  { value: "ita", label: "Italiano" },
  { value: "por", label: "Portugués" },
  { value: "jpn", label: "Japonés" },
  { value: "chi", label: "Chino" },
  { value: "rus", label: "Ruso" },
];

const SORT_OPTIONS = [
  { value: "", label: "Relevancia" },
  { value: "old", label: "Año (antiguo primero)" },
  { value: "new", label: "Año (nuevo primero)" },
  { value: "editions", label: "Cantidad de ediciones" },
];

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [language, setLanguage] = useState("");
  const [author, setAuthor] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleClear() {
    setMinYear("");
    setMaxYear("");
    setLanguage("");
    setAuthor("");
    setSortBy("");
    onFilterChange({
      minYear: "",
      maxYear: "",
      language: "",
      author: "",
      sortBy: "",
    });
  }

  function applyFilters() {
    onFilterChange({
      minYear,
      maxYear,
      language,
      author,
      sortBy,
    });
  }

    return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {isOpen ? "Cerrar filtros" : "Abrir filtros"}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Año mínimo
              </label>
              <input
                type="number"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                placeholder="Ej: 1900"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Año máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Año máximo
              </label>
              <input
                type="number"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                placeholder="Ej: 2024"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Idioma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Autor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Autor
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nombre del autor"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          { /* Botones de aplicar y limpiar */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
            >
              Limpiar
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );

  
}
