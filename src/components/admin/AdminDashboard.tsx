"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAdminEmail } from "@/lib/admin";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminDashboardData = {
  latestFeedback: Array<{
    created_at: string;
    id: string;
    message: string;
  }>;
  totals: {
    feedback: number;
    publicTierLists: number;
    tierLists: number;
  };
};

type AdminState = "loading" | "denied" | "ready" | "error";

export function AdminDashboard() {
  const [state, setState] = useState<AdminState>("loading");
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [message, setMessage] = useState("Cargando panel administrativo...");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;

        if (!isMounted) {
          return;
        }

        if (!session || !isAdminEmail(session.user.email)) {
          setState("denied");
          setMessage(
            "No tienes permiso para acceder al panel administrativo.",
          );
          return;
        }

        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const result = (await response.json()) as
          | AdminDashboardData
          | { error?: string };

        if (!isMounted) {
          return;
        }

        if (!response.ok || !("totals" in result)) {
          setState(response.status === 401 || response.status === 403 ? "denied" : "error");
          setMessage(
            "error" in result && result.error
              ? result.error
              : "No se pudo cargar el panel administrativo.",
          );
          return;
        }

        setData(result);
        setState("ready");
        setMessage("");
      } catch {
        if (!isMounted) {
          return;
        }

        setState("error");
        setMessage("No se pudo cargar el panel administrativo.");
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state !== "ready" || !data) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">
          {state === "denied" ? "Acceso denegado" : "Panel administrativo"}
        </h1>
        <p className="mt-3 text-slate-600">{message}</p>
        <Link
          href={state === "denied" ? "/login" : "/"}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {state === "denied" ? "Ir a iniciar sesion" : "Volver al inicio"}
        </Link>
      </div>
    );
  }

  const summaryCards = [
    { label: "Tierlists guardadas", value: data.totals.tierLists },
    { label: "Tierlists publicas", value: data.totals.publicTierLists },
    { label: "Mensajes de feedback", value: data.totals.feedback },
  ];

  return (
    <section className="grid gap-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Administracion
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-950">
          Resumen de TierMaker
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">
              {card.value.toLocaleString("es-MX")}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">
          Feedback reciente
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Se muestran los ultimos 10 mensajes, sin nombres ni correos.
        </p>

        {data.latestFeedback.length > 0 ? (
          <div className="mt-5 divide-y divide-slate-200">
            {data.latestFeedback.map((feedback) => (
              <article key={feedback.id} className="py-5 first:pt-0 last:pb-0">
                <p className="whitespace-pre-wrap break-words leading-7 text-slate-700">
                  {feedback.message}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-400">
                  {new Intl.DateTimeFormat("es-MX", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(feedback.created_at))}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            Todavia no hay mensajes de feedback.
          </p>
        )}
      </section>
    </section>
  );
}
