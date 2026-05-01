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
    onFilterChange({ minYear: "", maxYear: "", language: "", author: "", sortBy: "" });
  }

  function applyFilters() {
    onFilterChange({ minYear, maxYear, language, author, sortBy });
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="filter-toggle ui-btn ui-btn--ghost"
          aria-expanded={isOpen}
          aria-controls="filter-panel"
        >
          {isOpen ? "Cerrar filtros" : "Abrir filtros"}
        </button>

        <div className="filter-summary">{language || author || minYear || maxYear ? 'Filtros activos' : 'Sin filtros'}</div>
      </div>

      {isOpen && (
        <div id="filter-panel" className="mt-3 filter-panel-card">
          <div className="filter-grid">
            <div>
              <label htmlFor="minYear" className="block text-sm font-medium text-gray-700 mb-1">Año mínimo</label>
              <input id="minYear" type="number" value={minYear} onChange={(e) => setMinYear(e.target.value)} placeholder="Ej: 1900" className="ui-input w-full" />
            </div>

            <div>
              <label htmlFor="maxYear" className="block text-sm font-medium text-gray-700 mb-1">Año máximo</label>
              <input id="maxYear" type="number" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} placeholder="Ej: 2024" className="ui-input w-full" />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
              <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="ui-select w-full">
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
              <input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nombre del autor" className="ui-input w-full" />
            </div>

            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ui-select w-full">
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleClear} className="ui-btn ui-btn--ghost">Limpiar</button>
            <button onClick={applyFilters} className="ui-btn ui-btn--primary">Aplicar</button>
          </div>
        </div>
      )}
    </div>
  );

}
