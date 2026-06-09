import Link from "next/link";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { TierListBuilder } from "@/components/tierlist/TierListBuilder";

export default function CrearPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-xl font-black tracking-tight">
            TierMaker
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Volver al inicio
            </Link>
            <AuthStatus />
          </div>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Constructor interactivo
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Crea una tier list visual en minutos.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Esta primera version muestra la estructura del editor: niveles
              configurados, areas para items y una bandeja con tarjetas de
              ejemplo que puedes arrastrar.
            </p>
          </div>

          <TierListBuilder />
        </div>
      </section>
    </main>
  );
}
