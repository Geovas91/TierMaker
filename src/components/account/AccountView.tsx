"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AccountTierListSummary = {
  created_at: string;
  id: string;
  is_public: boolean;
  title: string;
  updated_at: string;
};

export function AccountView() {
  const [user, setUser] = useState<User | null>(null);
  const [tierLists, setTierLists] = useState<AccountTierListSummary[]>([]);
  const [message, setMessage] = useState("Cargando cuenta...");

  useEffect(() => {
    let isMounted = true;

    async function fetchAccount() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        if (userError || !userData.user) {
          setMessage("Inicia sesion para ver tu cuenta.");
          return;
        }

        setUser(userData.user);

        const { data, error } = await supabase
          .from("tier_lists")
          .select("id,title,is_public,created_at,updated_at")
          .eq("user_id", userData.user.id)
          .order("updated_at", { ascending: false });

        if (!isMounted) {
          return;
        }

        if (error) {
          setMessage(error.message);
          return;
        }

        setTierLists((data ?? []) as AccountTierListSummary[]);
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

    fetchAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  if (message) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Cuenta</h1>
        <p className="mt-3 text-slate-600">{message}</p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Ir a login
        </Link>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Mi cuenta
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Informacion de usuario
        </h1>
        <div className="mt-5 grid gap-3 text-sm">
          <p className="rounded-md bg-slate-50 p-3 text-slate-700">
            <span className="font-semibold text-slate-950">Email:</span>{" "}
            {user.email}
          </p>
          <p className="break-all rounded-md bg-slate-50 p-3 text-slate-700">
            <span className="font-semibold text-slate-950">User id:</span>{" "}
            {user.id}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Tierlists guardadas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Listado de tierlists guardadas en tu cuenta.
            </p>
          </div>
          <Link
            href="/crear"
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Ir al editor
          </Link>
        </div>

        {tierLists.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {tierLists.map((tierList) => (
              <article
                key={tierList.id}
                className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {tierList.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>
                      Actualizada:{" "}
                      {new Date(tierList.updated_at).toLocaleString()}
                    </span>
                    <span className="font-semibold">
                      {tierList.is_public ? "Publica" : "Privada"}
                    </span>
                  </div>
                </div>
                {tierList.is_public ? (
                  <Link
                    href={`/tierlist/${tierList.id}`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Ver publica
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            Todavia no tienes tierlists guardadas.
          </p>
        )}
      </div>
    </section>
  );
}
