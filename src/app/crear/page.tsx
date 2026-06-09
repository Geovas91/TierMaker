import Link from "next/link";
import { ItemTray } from "@/components/tierlist/ItemTray";
import { TierRow } from "@/components/tierlist/TierRow";

const tiers = [
  { label: "S", colorClassName: "bg-rose-500" },
  { label: "A", colorClassName: "bg-orange-400" },
  { label: "B", colorClassName: "bg-amber-300" },
  { label: "C", colorClassName: "bg-emerald-300" },
  { label: "D", colorClassName: "bg-sky-300" },
];

export default function CrearPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-xl font-black tracking-tight">
            TierMaker
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Constructor estatico
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Crea una tier list visual en minutos.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Esta primera version muestra la estructura del editor: niveles
              configurados, areas vacias para items y una bandeja con tarjetas
              de ejemplo.
            </p>
          </div>

          <div className="grid gap-6">
            <section className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-xl shadow-slate-200">
              <div className="mb-3 flex flex-col gap-3 rounded-md bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Mi nueva tier list
                  </p>
                  <p className="text-sm text-slate-400">
                    Borrador sin guardar, listo para futuras funciones.
                  </p>
                </div>
                <span className="w-fit rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
                  Vista previa
                </span>
              </div>

              <div className="grid gap-3">
                {tiers.map((tier) => (
                  <TierRow
                    key={tier.label}
                    label={tier.label}
                    colorClassName={tier.colorClassName}
                  />
                ))}
              </div>
            </section>

            <ItemTray />
          </div>
        </div>
      </section>
    </main>
  );
}
