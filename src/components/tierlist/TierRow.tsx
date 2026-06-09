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
  canDelete: boolean;
  canMoveDown: boolean;
  canMoveUp: boolean;
  onDelete: () => void;
  onLabelChange: (label: string) => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  renderItem: (item: TierItem) => ReactNode;
};

export function TierRow({
  label,
  colorClassName,
  containerId,
  items,
  canDelete,
  canMoveDown,
  canMoveUp,
  onDelete,
  onLabelChange,
  onMoveDown,
  onMoveUp,
  renderItem,
}: TierRowProps) {
  const { isOver, setNodeRef } = useDroppable({ id: containerId });

  return (
    <section
      ref={setNodeRef}
      className={`grid overflow-hidden rounded-lg border bg-white shadow-sm transition sm:grid-cols-[6rem_1fr] ${
        isOver ? "border-rose-300 shadow-rose-200/70" : "border-slate-200"
      }`}
    >
      <TierLabel
        label={label}
        colorClassName={colorClassName}
        onLabelChange={onLabelChange}
      />
      <div className="min-h-28 border-t border-slate-200 bg-slate-50 p-4 sm:border-l sm:border-t-0">
        <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Subir
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Bajar
          </button>
          {canDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-8 items-center justify-center rounded-md border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Eliminar
            </button>
          ) : null}
        </div>
        <div
          data-testid={`tier-dropzone-${containerId}`}
          className={`min-h-24 rounded-md border border-dashed px-4 py-4 transition ${
            isOver
              ? "border-rose-400 bg-rose-50 ring-4 ring-rose-100"
              : "border-slate-300 bg-white/80"
          }`}
        >
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {items.map(renderItem)}
            </div>
          ) : (
            <div className="flex min-h-16 flex-col items-center justify-center gap-1 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Este tier esta vacio
              </p>
              <p className="text-xs leading-5 text-slate-400">
                Arrastra una tarjeta desde la bandeja o desde otro tier.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
