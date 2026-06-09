import type { Metadata } from "next";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { PublicTierListExplore } from "@/components/tierlist/PublicTierListExplore";

export const metadata: Metadata = {
  title: "Explorar tier lists publicas",
  description:
    "Explora tier lists publicas creadas por la comunidad, busca por titulo y ordena rankings compartidos.",
  alternates: {
    canonical: "/explorar",
  },
  openGraph: {
    title: "Explorar tier lists publicas | TierMaker",
    description:
      "Descubre rankings compartidos por otros usuarios y abre tier lists publicas en TierMaker.",
    url: "/explorar",
  },
  twitter: {
    card: "summary",
    title: "Explorar tier lists publicas | TierMaker",
    description:
      "Descubre rankings compartidos por otros usuarios en TierMaker.",
  },
};

export default function ExplorarPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-xl font-black tracking-tight">
            TierMaker
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/crear"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Crear tierlist
            </Link>
            <AuthStatus />
          </div>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Comunidad
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Explora tierlists publicas.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Descubre rankings compartidos por otros usuarios de TierMaker.
            </p>
          </div>

          <PublicTierListExplore />
          <div className="mt-8">
            <AdPlaceholder />
          </div>
        </div>
      </section>
    </main>
  );
}
