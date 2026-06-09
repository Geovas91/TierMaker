"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PublicTierListSummary = {
  created_at: string;
  id: string;
  title: string;
  user_id: string;
};

type SortOption = "recent" | "oldest" | "title";

function formatCreatedDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PublicTierListExplore() {
  const [tierLists, setTierLists] = useState<PublicTierListSummary[]>([]);
  const [message, setMessage] = useState("Cargando tierlists publicas...");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  useEffect(() => {
    let isMounted = true;

    async function fetchPublicTierLists() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("tier_lists")
          .select("id,title,user_id,created_at")
          .eq("is_public", true)
          .order("created_at", { ascending: false });

        if (!isMounted) {
          return;
        }

        if (error) {
          setMessage(error.message);
          return;
        }

        setTierLists((data ?? []) as PublicTierListSummary[]);
        setMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof Error) {
          setMessage(error.message);
        }
      }
    }

    fetchPublicTierLists();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleTierLists = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("es-MX");
    const filteredTierLists = normalizedQuery
      ? tierLists.filter((tierList) =>
          tierList.title.toLocaleLowerCase("es-MX").includes(normalizedQuery),
        )
      : tierLists;

    return [...filteredTierLists].sort((firstTierList, secondTierList) => {
      if (sortOption === "oldest") {
        return (
          new Date(firstTierList.created_at).getTime() -
          new Date(secondTierList.created_at).getTime()
        );
      }

      if (sortOption === "title") {
        return firstTierList.title.localeCompare(secondTierList.title, "es-MX", {
          sensitivity: "base",
        });
      }

      return (
        new Date(secondTierList.created_at).getTime() -
        new Date(firstTierList.created_at).getTime()
      );
    });
  }, [searchQuery, sortOption, tierLists]);

  if (message) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">
          Tierlists publicas
        </h2>
        <p className="mt-3 text-slate-600">{message}</p>
      </div>
    );
  }

  if (tierLists.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">
          Aun no hay tierlists publicas
        </h2>
        <p className="mt-3 text-slate-600">
          Cuando alguien publique una tierlist, aparecera aqui.
        </p>
        <Link
          href="/crear"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Crear tierlist
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_14rem]">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Buscar por titulo
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-rose-500"
              placeholder="Ej. videojuegos, peliculas..."
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Ordenar
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base font-medium text-slate-950 outline-none transition hover:border-slate-400 focus:border-rose-500"
            >
              <option value="recent">Mas recientes</option>
              <option value="oldest">Mas antiguas</option>
              <option value="title">Titulo A-Z</option>
            </select>
          </label>
        </div>
      </div>

      {visibleTierLists.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">
            No hay resultados para esa busqueda
          </h2>
          <p className="mt-3 text-slate-600">
            Prueba con otro titulo o borra el texto de busqueda.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Limpiar busqueda
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTierLists.map((tierList) => (
            <article
              key={tierList.id}
              className="flex min-h-56 flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold leading-tight text-slate-950">
                  {tierList.title}
                </h2>
                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <p>
                    Creador:{" "}
                    <Link
                      href={`/u/${tierList.user_id}`}
                      className="font-semibold text-slate-800 transition hover:text-slate-950"
                    >
                      {tierList.user_id}
                    </Link>
                  </p>
                  <p>Creada: {formatCreatedDate(tierList.created_at)}</p>
                </div>
              </div>

              <Link
                href={`/tierlist/${tierList.id}`}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver tierlist publica
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
