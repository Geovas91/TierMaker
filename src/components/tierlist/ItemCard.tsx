type ItemCardProps = {
  title: string;
  accentClassName: string;
};

export function ItemCard({ title, accentClassName }: ItemCardProps) {
  return (
    <article className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`${accentClassName} flex aspect-square items-center justify-center text-sm font-bold text-slate-950`}
      >
        IMG
      </div>
      <div className="px-3 py-2">
        <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
      </div>
    </article>
  );
}
