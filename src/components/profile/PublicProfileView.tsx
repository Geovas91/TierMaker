"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PublicTierListSummary = {
  created_at: string;
  id: string;
  title: string;
  updated_at: string;
};

type PublicProfileViewProps = {
  userId: string;
};

export function PublicProfileView({ userId }: PublicProfileViewProps) {
  const [tierLists, setTierLists] = useState<PublicTierListSummary[]>([]);
  const [message, setMessage] = useState("Cargando perfil...");

  useEffect(() => {
    let isMounted = true;

    async function fetchPublicTierLists() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("tier_lists")
          .select("id,title,created_at,updated_at")
          .eq("user_id", userId)
          .eq("is_public", true)
          .order("updated_at", { ascending: false });

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
  }, [userId]);

  return (
    <section className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Perfil publico
        </p>
        <h1 className="mt-2 break-all text-3xl font-semibold text-slate-950">
          {userId}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Tierlists publicas compartidas por este usuario.
        </p>
      </div>

      {message ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          {message}
        </div>
      ) : tierLists.length > 0 ? (
        <div className="grid gap-3">
          {tierLists.map((tierList) => (
            <article
              key={tierList.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {tierList.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Actualizada: {new Date(tierList.updated_at).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/tierlist/${tierList.id}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver tierlist
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Este usuario no tiene tierlists publicas todavia.
        </div>
      )}
    </section>
  );
}
