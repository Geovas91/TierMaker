import { TierLabel } from "./TierLabel";

type TierRowProps = {
  label: string;
  colorClassName: string;
};

export function TierRow({ label, colorClassName }: TierRowProps) {
  return (
    <section className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-[6rem_1fr]">
      <TierLabel label={label} colorClassName={colorClassName} />
      <div className="min-h-28 border-t border-slate-200 bg-slate-50 p-4 sm:border-l sm:border-t-0">
        <div className="flex min-h-20 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white/80 px-4 text-center text-sm font-medium text-slate-400">
          Suelta elementos aqui cuando el editor sea interactivo
        </div>
      </div>
    </section>
  );
}
