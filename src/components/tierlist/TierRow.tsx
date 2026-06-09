 "use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { TierLabel } from "./TierLabel";
import type { TierItem } from "./types";

type TierRowProps = {
  label: string;
  colorClassName: string;
  containerId: string;
  items: TierItem[];
  renderItem: (item: TierItem) => ReactNode;
};

export function TierRow({
  label,
  colorClassName,
  containerId,
  items,
  renderItem,
}: TierRowProps) {
  const { isOver, setNodeRef } = useDroppable({ id: containerId });

  return (
    <section className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-[6rem_1fr]">
      <TierLabel label={label} colorClassName={colorClassName} />
      <div className="min-h-28 border-t border-slate-200 bg-slate-50 p-4 sm:border-l sm:border-t-0">
        <div
          ref={setNodeRef}
          data-testid={`tier-dropzone-${containerId}`}
          className={`min-h-20 rounded-md border border-dashed px-4 py-4 transition ${
            isOver
              ? "border-rose-400 bg-rose-50"
              : "border-slate-300 bg-white/80"
          }`}
        >
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {items.map(renderItem)}
            </div>
          ) : (
            <div className="flex min-h-12 items-center justify-center text-center text-sm font-medium text-slate-400">
              Arrastra elementos aqui
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
