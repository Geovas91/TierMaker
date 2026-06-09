import { ItemCard } from "./ItemCard";

const sampleItems = [
  "Personaje 01",
  "Personaje 02",
  "Personaje 03",
  "Personaje 04",
  "Personaje 05",
  "Personaje 06",
  "Personaje 07",
  "Personaje 08",
  "Personaje 09",
  "Personaje 10",
];

const accents = [
  "bg-rose-200",
  "bg-orange-200",
  "bg-amber-200",
  "bg-lime-200",
  "bg-emerald-200",
  "bg-cyan-200",
  "bg-sky-200",
  "bg-indigo-200",
  "bg-fuchsia-200",
  "bg-slate-200",
];

export function ItemTray() {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            Bandeja de items
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Elementos de ejemplo
          </h2>
        </div>
        <p className="text-sm text-slate-500">10 tarjetas placeholder</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sampleItems.map((item, index) => (
          <ItemCard
            key={item}
            title={item}
            accentClassName={accents[index]}
          />
        ))}
      </div>
    </aside>
  );
}
