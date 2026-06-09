type TierLabelProps = {
  label: string;
  colorClassName: string;
};

export function TierLabel({ label, colorClassName }: TierLabelProps) {
  return (
    <div
      className={`${colorClassName} flex min-h-24 items-center justify-center px-5 text-3xl font-black text-slate-950 sm:min-h-28`}
    >
      {label}
    </div>
  );
}
