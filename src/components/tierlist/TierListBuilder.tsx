"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ItemCard } from "./ItemCard";
import { ItemTray } from "./ItemTray";
import { TierRow } from "./TierRow";
import type { ContainerId, Tier, TierItem } from "./types";

const initialTiers: Tier[] = [
  { id: "tier-s", label: "S", colorClassName: "bg-rose-500", isDefault: true },
  { id: "tier-a", label: "A", colorClassName: "bg-orange-400", isDefault: true },
  { id: "tier-b", label: "B", colorClassName: "bg-amber-300", isDefault: true },
  { id: "tier-c", label: "C", colorClassName: "bg-emerald-300", isDefault: true },
  { id: "tier-d", label: "D", colorClassName: "bg-sky-300", isDefault: true },
];

const tierColorClasses = [
  "bg-violet-300",
  "bg-pink-300",
  "bg-teal-300",
  "bg-lime-300",
  "bg-cyan-300",
  "bg-fuchsia-300",
  "bg-slate-300",
];

const initialItems: TierItem[] = [
  { id: "item-01", title: "Personaje 01", accentClassName: "bg-rose-200" },
  { id: "item-02", title: "Personaje 02", accentClassName: "bg-orange-200" },
  { id: "item-03", title: "Personaje 03", accentClassName: "bg-amber-200" },
  { id: "item-04", title: "Personaje 04", accentClassName: "bg-lime-200" },
  { id: "item-05", title: "Personaje 05", accentClassName: "bg-emerald-200" },
  { id: "item-06", title: "Personaje 06", accentClassName: "bg-cyan-200" },
  { id: "item-07", title: "Personaje 07", accentClassName: "bg-sky-200" },
  { id: "item-08", title: "Personaje 08", accentClassName: "bg-indigo-200" },
  { id: "item-09", title: "Personaje 09", accentClassName: "bg-fuchsia-200" },
  { id: "item-10", title: "Personaje 10", accentClassName: "bg-slate-200" },
];

const initialLocations = initialItems.reduce<Record<string, ContainerId>>(
  (locations, item) => {
    locations[item.id] = "tray";
    return locations;
  },
  {},
);

function DraggableCard({ item }: { item: TierItem }) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: item.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-testid={`draggable-${item.id}`}
      className="touch-none"
    >
      <ItemCard
        title={item.title}
        accentClassName={item.accentClassName}
        imageUrl={item.imageUrl}
        className={isDragging ? "opacity-40" : "cursor-grab active:cursor-grabbing"}
      />
    </div>
  );
}

export function TierListBuilder() {
  const [items, setItems] = useState(initialItems);
  const [tiers, setTiers] = useState(initialTiers);
  const [itemLocations, setItemLocations] = useState(initialLocations);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const customTierCountRef = useRef(0);
  const exportRef = useRef<HTMLElement | null>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
  );

  const itemsByContainer = useMemo(() => {
    const emptyGroups = tiers.reduce<Record<ContainerId, TierItem[]>>(
      (groups, tier) => {
        groups[tier.id] = [];
        return groups;
      },
      { tray: [] },
    );

    return items.reduce<Record<ContainerId, TierItem[]>>(
      (groups, item) => {
        const location = itemLocations[item.id];
        const container = groups[location] ? location : "tray";

        groups[container].push(item);
        return groups;
      },
      emptyGroups,
    );
  }, [itemLocations, items, tiers]);

  const activeItem = activeItemId
    ? items.find((item) => item.id === activeItemId)
    : undefined;

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  function createUploadId(file: File) {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `upload-${crypto.randomUUID()}`;
    }

    return `upload-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
  }

  function getTitleFromFilename(filename: string) {
    return filename.replace(/\.[^/.]+$/, "") || "Imagen subida";
  }

  function handleUploadImages(files: FileList) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      return;
    }

    const uploadedItems = imageFiles.map<TierItem>((file) => {
      const imageUrl = URL.createObjectURL(file);
      objectUrlsRef.current.add(imageUrl);

      return {
        id: createUploadId(file),
        title: getTitleFromFilename(file.name),
        accentClassName: "bg-slate-200",
        imageUrl,
      };
    });

    setItems((current) => [...current, ...uploadedItems]);
    setItemLocations((current) => ({
      ...current,
      ...uploadedItems.reduce<Record<string, ContainerId>>((locations, item) => {
        locations[item.id] = "tray";
        return locations;
      }, {}),
    }));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveItemId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    const activeId = String(event.active.id);

    setActiveItemId(null);

    if (!overId) {
      return;
    }

    const targetContainer = String(overId) as ContainerId;
    const validContainers: ContainerId[] = [
      "tray",
      ...tiers.map((tier) => tier.id),
    ];

    if (!validContainers.includes(targetContainer)) {
      return;
    }

    setItemLocations((current) => ({
      ...current,
      [activeId]: targetContainer,
    }));
  }

  function handleAddTier() {
    const customIndex = customTierCountRef.current + 1;
    const colorClassName =
      tierColorClasses[customTierCountRef.current % tierColorClasses.length];

    customTierCountRef.current = customIndex;

    setTiers((current) => [
      ...current,
      {
        id: `tier-custom-${Date.now()}-${customIndex}`,
        label: `Nuevo ${customIndex}`,
        colorClassName,
      },
    ]);
  }

  function handleUpdateTierLabel(tierId: string, label: string) {
    setTiers((current) =>
      current.map((tier) => (tier.id === tierId ? { ...tier, label } : tier)),
    );
  }

  function handleDeleteTier(tierId: string) {
    setTiers((current) =>
      current.filter((tier) => tier.id !== tierId || tier.isDefault),
    );
    setItemLocations((current) => {
      const next = { ...current };

      Object.entries(next).forEach(([itemId, containerId]) => {
        if (containerId === tierId) {
          next[itemId] = "tray";
        }
      });

      return next;
    });
  }

  function handleMoveTier(tierId: string, direction: -1 | 1) {
    setTiers((current) => {
      const index = current.findIndex((tier) => tier.id === tierId);
      const targetIndex = index + direction;

      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [tier] = next.splice(index, 1);

      next.splice(targetIndex, 0, tier);
      return next;
    });
  }

  async function handleExportImage() {
    if (!exportRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#020617",
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");

      link.download = "tierlist.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItemId(null)}
    >
      <div className="grid gap-6">
        <section
          ref={exportRef}
          data-testid="tierlist-export-area"
          className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-xl shadow-slate-200"
        >
          <div className="mb-3 flex flex-col gap-3 rounded-md bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Mi nueva tier list</p>
              <p className="text-sm text-slate-400">
                Borrador local, listo para organizar tus elementos.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAddTier}
                className="inline-flex h-10 items-center justify-center rounded-md border border-white/15 bg-slate-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Agregar tier
              </button>
              <span className="w-fit rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
                Arrastra y suelta
              </span>
              <button
                type="button"
                onClick={handleExportImage}
                disabled={isExporting}
                className="inline-flex h-10 items-center justify-center rounded-md bg-amber-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExporting ? "Exportando..." : "Exportar como imagen"}
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {tiers.map((tier, index) => (
              <TierRow
                key={tier.id}
                label={tier.label}
                colorClassName={tier.colorClassName}
                containerId={tier.id}
                items={itemsByContainer[tier.id]}
                canDelete={!tier.isDefault}
                canMoveDown={index < tiers.length - 1}
                canMoveUp={index > 0}
                onDelete={() => handleDeleteTier(tier.id)}
                onLabelChange={(label) => handleUpdateTierLabel(tier.id, label)}
                onMoveDown={() => handleMoveTier(tier.id, 1)}
                onMoveUp={() => handleMoveTier(tier.id, -1)}
                renderItem={(item) => <DraggableCard key={item.id} item={item} />}
              />
            ))}
          </div>
        </section>

        <ItemTray
          items={itemsByContainer.tray}
          onUploadImages={handleUploadImages}
          renderItem={(item) => <DraggableCard key={item.id} item={item} />}
        />
      </div>

      <DragOverlay>
        {activeItem ? (
          <ItemCard
            title={activeItem.title}
            accentClassName={activeItem.accentClassName}
            imageUrl={activeItem.imageUrl}
            className="rotate-2 cursor-grabbing shadow-xl"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
