"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function initializeAuth() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        if (error) {
          setAuthError(error.message);
        }

        setUser(data.user);
        setIsReady(true);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          setIsReady(true);
        });

        unsubscribe = () => subscription.unsubscribe();
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof Error) {
          setAuthError(error.message);
        }

        setIsReady(true);
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  async function handleLogout() {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthError(error.message);
        return;
      }

      setUser(null);
      setAuthError("");
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      }
    }
  }

  if (authError) {
    return (
      <Link
        href="/login"
        className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Iniciar sesion
      </Link>
    );
  }

  if (!isReady) {
    return (
      <span className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500">
        Revisando sesion
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Iniciar sesion
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="max-w-64 truncate rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
        {user.email}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Cerrar sesion
      </button>
    </div>
  );
}
