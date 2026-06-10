import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

export const metadata: Metadata = {
  title: "Enviar feedback",
  description:
    "Comparte comentarios y sugerencias para ayudar a mejorar TierMaker.",
  alternates: {
    canonical: "/feedback",
  },
  openGraph: {
    title: "Enviar feedback | TierMaker",
    description:
      "Comparte comentarios y sugerencias para ayudar a mejorar TierMaker.",
    url: "/feedback",
  },
};

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            TierMaker
          </Link>
          <Link
            href="/crear"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Ir al editor
          </Link>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto grid max-w-4xl gap-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Feedback
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Ayudanos a mejorar TierMaker.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Comparte una sugerencia, reporta un problema o cuentanos que te
              gustaria ver en la plataforma.
            </p>
          </div>

          <FeedbackForm />
        </div>
      </section>
    </main>
  );
}
