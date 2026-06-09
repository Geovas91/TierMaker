"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { TierItem } from "./types";

type ItemTrayProps = {
  items: TierItem[];
  renderItem: (item: TierItem) => ReactNode;
};

export function ItemTray({ items, renderItem }: ItemTrayProps) {
  const { isOver, setNodeRef } = useDroppable({ id: "tray" });

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
        <p className="text-sm text-slate-500">{items.length} tarjetas disponibles</p>
      </div>

      <div
        ref={setNodeRef}
        data-testid="item-tray-dropzone"
        className={`mt-5 min-h-36 rounded-md border border-dashed p-3 transition ${
          isOver ? "border-rose-400 bg-rose-50" : "border-transparent bg-slate-50"
        }`}
      >
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map(renderItem)}
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center text-center text-sm font-medium text-slate-400">
            Todos los elementos estan ubicados en tiers
          </div>
        )}
      </div>
    </aside>
  );
}
