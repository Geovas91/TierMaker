type AdPlaceholderProps = {
  className?: string;
  label?: string;
};

export function AdPlaceholder({
  className = "",
  label = "Espacio publicitario",
}: AdPlaceholderProps) {
  return (
    <aside
      aria-label={label}
      className={`flex min-h-24 w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-xs font-semibold uppercase tracking-wide text-slate-400 shadow-sm ${className}`}
    >
      {label}
    </aside>
  );
}
