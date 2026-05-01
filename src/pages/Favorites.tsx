"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, removeFavorite, FavoriteBook } from "@/utils/storage";
import styles from "./Favorites.module.scss";

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
      <div className={styles.pageWrapper}>
        <div className={styles.inner}>
          <p className="ui-kicker">Cargando favoritos</p>
          <div className={styles.grid} style={{ marginTop: "1rem" }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-stone-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <Link href="/buscar" className={styles.backLink}>
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold">Mis Favoritos</h1>
          {favorites.length > 0 && (
            <span className={styles.countBadge}>
              {favorites.length} libro{favorites.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <p className="text-4xl mb-4"></p>
            <h2 className="text-2xl font-semibold mb-2">Sin favoritos aún</h2>
            <p className="text-stone-600 mb-6">
              Busca libros y agrega tus favoritos para verlos aquí
            </p>
            <Link href="/buscar" className="ui-btn ui-btn--primary">
              Buscar libros
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((book) => (
              <div key={book.workId} className={styles.card}>
                <div className={styles.coverArea}>
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className={styles.coverImg} />
                  ) : (
                    <div className={styles.coverPlaceholder}>
                      <span></span>
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <Link href={`/libro/${book.workId}`} className="block group/title">
                    <h3 className="font-semibold line-clamp-2 hover:text-rose-600 transition">
                      {book.title}
                    </h3>
                  </Link>

                  {book.authors.length > 0 && (
                    <p className="text-sm text-stone-600 mt-2 line-clamp-1">
                      {book.authors.join(", ")}
                    </p>
                  )}

                  {book.year && (
                    <p className="text-xs text-stone-500 mt-1">{book.year}</p>
                  )}

                  <div className={styles.cardActions}>
                    <Link href={`/libro/${book.workId}`} className="ui-btn ui-btn--primary flex-1 text-center">
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
