type TierLabelProps = {
  label: string;
  colorClassName: string;
  onLabelChange: (label: string) => void;
};

export function TierLabel({
  label,
  colorClassName,
  onLabelChange,
}: TierLabelProps) {
  return (
    <div
      className={`${colorClassName} flex min-h-24 items-center justify-center px-4 text-3xl font-black text-slate-950 sm:min-h-28`}
    >
      <input
        type="text"
        value={label}
        aria-label={`Editar tier ${label}`}
        onChange={(event) => onLabelChange(event.target.value)}
        className="w-full min-w-0 rounded-md bg-transparent px-1 py-2 text-center font-black outline-none transition focus:bg-white/30"
        maxLength={18}
      />
    </div>
  );
}
