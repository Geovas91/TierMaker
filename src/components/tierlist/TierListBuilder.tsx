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
import type { ContainerId, TierId, TierItem } from "./types";

const tiers: { label: TierId; colorClassName: string }[] = [
  { label: "S", colorClassName: "bg-rose-500" },
  { label: "A", colorClassName: "bg-orange-400" },
  { label: "B", colorClassName: "bg-amber-300" },
  { label: "C", colorClassName: "bg-emerald-300" },
  { label: "D", colorClassName: "bg-sky-300" },
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
  const [itemLocations, setItemLocations] = useState(initialLocations);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
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
    return items.reduce<Record<ContainerId, TierItem[]>>(
      (groups, item) => {
        groups[itemLocations[item.id]].push(item);
        return groups;
      },
      { tray: [], S: [], A: [], B: [], C: [], D: [] },
    );
  }, [itemLocations, items]);

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
    const validContainers: ContainerId[] = ["tray", "S", "A", "B", "C", "D"];

    if (!validContainers.includes(targetContainer)) {
      return;
    }

    setItemLocations((current) => ({
      ...current,
      [activeId]: targetContainer,
    }));
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItemId(null)}
    >
      <div className="grid gap-6">
        <section className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-xl shadow-slate-200">
          <div className="mb-3 flex flex-col gap-3 rounded-md bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Mi nueva tier list</p>
              <p className="text-sm text-slate-400">
                Borrador local, listo para organizar tus elementos.
              </p>
            </div>
            <span className="w-fit rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
              Arrastra y suelta
            </span>
          </div>

          <div className="grid gap-3">
            {tiers.map((tier) => (
              <TierRow
                key={tier.label}
                label={tier.label}
                colorClassName={tier.colorClassName}
                containerId={tier.label}
                items={itemsByContainer[tier.label]}
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
