"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("feedback").insert({
        email: email.trim() || null,
        message: feedbackMessage.trim(),
        name: name.trim() || null,
      });

      if (error) {
        setStatusMessage(
          "No pudimos enviar tus comentarios. Intenta nuevamente mas tarde.",
        );
        return;
      }

      setName("");
      setEmail("");
      setFeedbackMessage("");
      setStatusMessage("Gracias. Tu feedback fue enviado correctamente.");
    } catch {
      setStatusMessage(
        "No pudimos enviar tus comentarios. Intenta nuevamente mas tarde.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Nombre <span className="font-normal text-slate-400">(opcional)</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            autoComplete="name"
            className="h-11 rounded-md border border-slate-300 px-3 text-base font-normal text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Email <span className="font-normal text-slate-400">(opcional)</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            autoComplete="email"
            className="h-11 rounded-md border border-slate-300 px-3 text-base font-normal text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Comentarios
        <textarea
          value={feedbackMessage}
          onChange={(event) => setFeedbackMessage(event.target.value)}
          required
          minLength={3}
          maxLength={4000}
          rows={7}
          placeholder="Cuentanos que funciona bien o que podemos mejorar."
          className="min-h-40 resize-y rounded-md border border-slate-300 px-3 py-3 text-base font-normal leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting || feedbackMessage.trim().length < 3}
        className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
      >
        {isSubmitting ? "Enviando..." : "Enviar feedback"}
      </button>

      {statusMessage ? (
        <p
          aria-live="polite"
          className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
