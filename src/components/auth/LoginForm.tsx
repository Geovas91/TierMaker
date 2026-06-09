"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const authResponse =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (authResponse.error) {
        setMessage(authResponse.error.message);
        return;
      }

      setMessage(
        mode === "login"
          ? "Sesion iniciada correctamente."
          : "Cuenta creada. Revisa tu correo si Supabase solicita confirmacion.",
      );
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          Acceso
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Usa email y contrasena. El editor local y localStorage siguen
          funcionando aunque no hayas iniciado sesion.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-md border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`h-10 rounded-md text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`h-10 rounded-md text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Signup
        </button>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-11 rounded-md border border-slate-300 px-3 text-sm font-medium outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            placeholder="tu@email.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="h-11 rounded-md border border-slate-300 px-3 text-sm font-medium outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            placeholder="Minimo 6 caracteres"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Procesando..."
            : mode === "login"
              ? "Iniciar sesion"
              : "Crear cuenta"}
        </button>
      </form>

      {message ? (
        <p className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          {message}
        </p>
      ) : null}

      <Link
        href="/crear"
        className="mt-5 inline-flex text-sm font-semibold text-slate-700 transition hover:text-slate-950"
      >
        Volver al editor
      </Link>
    </div>
  );
}
