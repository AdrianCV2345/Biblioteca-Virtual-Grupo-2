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

// === COMMIT 11: crear FilterPanel básico con estado y botón toggle ===
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

  
}
