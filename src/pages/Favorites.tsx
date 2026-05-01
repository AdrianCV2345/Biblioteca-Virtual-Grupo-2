"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, removeFavorite, FavoriteBook } from "@/utils/storage";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = getFavorites();
        setFavorites(savedFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (workId: string) => {
    removeFavorite(workId);
    setFavorites((prev) => prev.filter((book) => book.workId !== workId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 px-4 py-10 text-stone-900">
        <div className="mx-auto max-w-6xl rounded-3xl border border-stone-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Cargando favoritos</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-stone-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 px-4 py-8 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/buscar"
            className="inline-flex items-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
          >
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold"> Mis Favoritos</h1>
          {favorites.length > 0 && (
            <span className="ml-auto rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
              {favorites.length} libro{favorites.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
            <p className="text-4xl mb-4"></p>
            <h2 className="text-2xl font-semibold text-stone-900 mb-2">
              Sin favoritos aún
            </h2>
            <p className="text-stone-600 mb-6">
              Busca libros y agrega tus favoritos para verlos aquí
            </p>
            <Link
              href="/buscar"
              className="inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Buscar libros
            </Link>
          </div>
        ) : (
          /* Grid de Favoritos */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((book) => (
              <div
                key={book.workId}
                className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* Portada */}
                <div className="relative h-64 overflow-hidden bg-stone-100">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-stone-200">
                      <span className="text-4xl"></span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <Link
                    href={`/libro/${book.workId}`}
                    className="block group/title"
                  >
                    <h3 className="font-semibold text-stone-900 line-clamp-2 group-hover/title:text-rose-600 transition">
                      {book.title}
                    </h3>
                  </Link>

                  {book.authors.length > 0 && (
                    <p className="text-sm text-stone-600 mt-2 line-clamp-1">
                      {book.authors.join(", ")}
                    </p>
                  )}

                  {book.year && (
                    <p className="text-xs text-stone-500 mt-1"> {book.year}</p>
                  )}

                  {/* Botones */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/libro/${book.workId}`}
                      className="ui-btn ui-btn--primary flex-1 text-center"
                    >
                      Ver detalle
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(book.workId)}
                      className="ui-btn ui-btn--ghost flex-1"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
