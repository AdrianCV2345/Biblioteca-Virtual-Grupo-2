"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAuthorDetail,
  getBookDetail,
  getCoverUrl,
  OpenLibraryWorkDetail,
} from "@/services/openLibraryService";
import { FavoriteBook, isFavorite, toggleFavorite } from "@/utils/storage";

interface BookDetailPageProps {
  workId: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo cargar el detalle del libro.";
}

function getDescription(detail: OpenLibraryWorkDetail | null): string {
  if (!detail?.description) {
    return "No hay una descripción disponible para este libro.";
  }

  if (typeof detail.description === "string") {
    return detail.description;
  }

  return detail.description.value ?? "No hay una descripción disponible para este libro.";
}

function getPublishYear(detail: OpenLibraryWorkDetail | null): string {
  const source = detail?.first_publish_date ?? detail?.created?.value ?? "";
  if (!source) {
    return "No disponible";
  }

  const yearMatch = source.match(/\d{4}/);
  return yearMatch ? yearMatch[0] : source;
}

function getSubjects(detail: OpenLibraryWorkDetail | null): string[] {
  const subjects = [
    ...(detail?.subjects ?? []),
    ...(detail?.subject_places ?? []),
    ...(detail?.subject_people ?? []),
    ...(detail?.subject_times ?? []),
  ];

  return Array.from(new Set(subjects)).slice(0, 12);
}

export default function BookDetailPage({ workId }: BookDetailPageProps) {
  const [detail, setDetail] = useState<OpenLibraryWorkDetail | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadBook() {
      setLoading(true);
      setError(null);

      try {
        const bookDetail = (await getBookDetail(workId)) as OpenLibraryWorkDetail | null;

        if (!bookDetail) {
          throw new Error("No se encontró el detalle del libro.");
        }

        const authorNames = await Promise.all(
          (bookDetail.authors ?? []).map(async (authorRef) => {
            if (!authorRef.author?.key) {
              return null;
            }

            const authorDetail = await getAuthorDetail(authorRef.author.key);
            return authorDetail?.name ?? authorDetail?.personal_name ?? null;
          })
        );

        if (isMounted) {
          setDetail(bookDetail);
          setAuthors(authorNames.filter((name): name is string => Boolean(name)));
          setFavorite(isFavorite(workId));
        }
      } catch (loadError: unknown) {
        if (isMounted) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [workId]);

  const coverUrl = useMemo(() => getCoverUrl(detail?.covers?.[0], "L"), [detail]);

  function handleToggleFavorite() {
    if (!detail) {
      return;
    }

    const nextFavoriteState = toggleFavorite({
      workId,
      title: detail.title,
      coverUrl,
      authors,
      year: getPublishYear(detail),
      description: getDescription(detail),
      subjects: getSubjects(detail),
      openLibraryUrl: `https://openlibrary.org${detail.key}`,
    } satisfies FavoriteBook);

    setFavorite(nextFavoriteState);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 px-4 py-10 text-stone-900">
        <div className="mx-auto max-w-5xl rounded-3xl border border-stone-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Cargando detalle</p>
          <div className="mt-4 h-8 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-stone-200" />
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 px-4 py-10 text-stone-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Detalle no disponible</p>
          <h1 className="mt-3 text-3xl font-semibold">No pudimos cargar este libro</h1>
          <p className="mt-3 text-stone-600">{error ?? "Intenta volver a la búsqueda y abrir otro libro."}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/buscar"
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subjects = getSubjects(detail);
  const openLibraryUrl = `https://openlibrary.org${detail.key}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 px-4 py-8 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/buscar"
            className="inline-flex items-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
          >
            Volver
          </Link>
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition ${
              favorite
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "border border-stone-300 bg-white text-stone-900 hover:border-stone-900 hover:bg-stone-900 hover:text-white"
            }`}
          >
            {favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={`Portada de ${detail.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[520px] items-center justify-center bg-stone-200 px-8 text-center text-stone-500">
                No hay portada disponible
              </div>
            )}
          </div>

          <section className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Detalle del libro</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{detail.title}</h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Autores</p>
                <p className="mt-2 text-lg text-stone-800">
                  {authors.length > 0 ? authors.join(", ") : "No disponible"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Año</p>
                <p className="mt-2 text-lg text-stone-800">{getPublishYear(detail)}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Descripción</p>
              <p className="mt-2 whitespace-pre-line text-base leading-7 text-stone-700">
                {getDescription(detail)}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Temas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-sm text-stone-700"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-stone-600">No hay temas disponibles.</span>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={openLibraryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                Ver en Open Library
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}