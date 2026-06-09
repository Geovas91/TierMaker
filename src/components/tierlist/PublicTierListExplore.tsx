"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PublicTierListSummary = {
  created_at: string;
  id: string;
  title: string;
  user_id: string;
};

function formatCreatedDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PublicTierListExplore() {
  const [tierLists, setTierLists] = useState<PublicTierListSummary[]>([]);
  const [message, setMessage] = useState("Cargando tierlists publicas...");

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tierLists.map((tierList) => (
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
  );
}
