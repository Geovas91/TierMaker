"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { TierItem } from "./types";

type ItemTrayProps = {
  items: TierItem[];
  onUploadImages: (files: FileList) => void;
  renderItem: (item: TierItem) => ReactNode;
};

export function ItemTray({ items, onUploadImages, renderItem }: ItemTrayProps) {
  const { isOver, setNodeRef } = useDroppable({ id: "tray" });

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            Bandeja de items
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Elementos de ejemplo
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Arrastra tarjetas a los tiers o sube imagenes desde tu equipo para
            crear nuevos items locales.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <label className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto">
            Subir imagenes
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                if (event.target.files?.length) {
                  onUploadImages(event.target.files);
                  event.target.value = "";
                }
              }}
            />
          </label>
          <p className="text-sm text-slate-500">
            {items.length} tarjetas disponibles
          </p>
        </div>
      </div>

      <div
        ref={setNodeRef}
        data-testid="item-tray-dropzone"
        className={`mt-5 min-h-36 rounded-md border border-dashed p-3 transition ${
          isOver
            ? "border-rose-400 bg-rose-50 ring-4 ring-rose-100"
            : "border-transparent bg-slate-50"
        }`}
      >
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map(renderItem)}
          </div>
        ) : (
          <div className="flex min-h-28 flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-semibold text-slate-500">
              La bandeja esta vacia
            </p>
            <p className="text-xs leading-5 text-slate-400">
              Puedes mover tarjetas de vuelta desde cualquier tier o subir mas
              imagenes.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
