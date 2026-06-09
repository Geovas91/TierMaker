type ItemCardProps = {
  title: string;
  accentClassName: string;
  imageUrl?: string;
  className?: string;
};

export function ItemCard({
  title,
  accentClassName,
  imageUrl,
  className = "",
}: ItemCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      {imageUrl ? (
        <div
          className="aspect-square bg-cover bg-center"
          role="img"
          aria-label={`Vista previa de ${title}`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div
          className={`${accentClassName} flex aspect-square items-center justify-center text-sm font-bold text-slate-950`}
        >
          IMG
        </div>
      )}
      <div className="px-3 py-2">
        <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
      </div>
    </article>
  );
}
