"use client";

import { useMemo, useRef, useState } from "react";
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

const storageKey = "tiermaker:tierlist-builder:v1";

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

const templates = [
  {
    id: "anime",
    name: "Anime",
    items: [
      "Naruto Uzumaki",
      "Monkey D. Luffy",
      "Goku",
      "Sailor Moon",
      "Levi Ackerman",
      "Tanjiro Kamado",
      "Edward Elric",
      "Asuka Langley",
      "Totoro",
      "Light Yagami",
    ],
  },
  {
    id: "videojuegos",
    name: "Videojuegos",
    items: [
      "The Legend of Zelda",
      "Minecraft",
      "Elden Ring",
      "Super Mario Odyssey",
      "Halo",
      "Fortnite",
      "God of War",
      "Resident Evil",
      "Stardew Valley",
      "Final Fantasy VII",
    ],
  },
  {
    id: "peliculas",
    name: "Películas",
    items: [
      "El Padrino",
      "Matrix",
      "Toy Story",
      "Interestelar",
      "Parasite",
      "Titanic",
      "Mad Max: Fury Road",
      "La La Land",
      "Spider-Man 2",
      "Coco",
    ],
  },
  {
    id: "series",
    name: "Series",
    items: [
      "Breaking Bad",
      "The Office",
      "Stranger Things",
      "Los Soprano",
      "Game of Thrones",
      "Dark",
      "The Last of Us",
      "Friends",
      "Better Call Saul",
      "The Bear",
    ],
  },
] as const;

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

type SavedTierListState = {
  itemLocations: Record<string, ContainerId>;
  items: TierItem[];
  tiers: Tier[];
};

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
        className={
          isDragging
            ? "scale-95 opacity-35 ring-2 ring-rose-300"
            : "cursor-grab active:cursor-grabbing"
        }
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
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const customTierCountRef = useRef(0);
  const exportRef = useRef<HTMLDivElement | null>(null);

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

  function createUploadId(file: File) {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `upload-${crypto.randomUUID()}`;
    }

    return `upload-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
  }

  function getTitleFromFilename(filename: string) {
    return filename.replace(/\.[^/.]+$/, "") || "Imagen subida";
  }

  function buildTemplateItems(template: (typeof templates)[number]) {
    return template.items.map<TierItem>((title, index) => ({
      id: `template-${template.id}-${index + 1}`,
      title,
      accentClassName: tierColorClasses[index % tierColorClasses.length],
    }));
  }

  function buildTrayLocations(nextItems: TierItem[]) {
    return nextItems.reduce<Record<string, ContainerId>>((locations, item) => {
      locations[item.id] = "tray";
      return locations;
    }, {});
  }

  function hasExistingProgress() {
    return (
      JSON.stringify(items) !== JSON.stringify(initialItems) ||
      JSON.stringify(tiers) !== JSON.stringify(initialTiers) ||
      JSON.stringify(itemLocations) !== JSON.stringify(initialLocations)
    );
  }

  function readImageAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("No se pudo leer la imagen."));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleUploadImages(files: FileList) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      return;
    }

    const uploadedItems = await Promise.all(
      imageFiles.map(async (file) => ({
        id: createUploadId(file),
        title: getTitleFromFilename(file.name),
        accentClassName: "bg-slate-200",
        imageUrl: await readImageAsDataUrl(file),
      })),
    );

    setItems((current) => [...current, ...uploadedItems]);
    setItemLocations((current) => ({
      ...current,
      ...uploadedItems.reduce<Record<string, ContainerId>>((locations, item) => {
        locations[item.id] = "tray";
        return locations;
      }, {}),
    }));
    setStatusMessage(`${uploadedItems.length} imagen(es) agregada(s).`);
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

  function getResetLocations() {
    return initialItems.reduce<Record<string, ContainerId>>((locations, item) => {
      locations[item.id] = "tray";
      return locations;
    }, {});
  }

  function getNextCustomTierCount(savedTiers: Tier[]) {
    return savedTiers.filter((tier) => !tier.isDefault).length;
  }

  function isSavedTierListState(value: unknown): value is SavedTierListState {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as Partial<SavedTierListState>;

    return (
      Array.isArray(candidate.items) &&
      Array.isArray(candidate.tiers) &&
      Boolean(candidate.itemLocations) &&
      typeof candidate.itemLocations === "object"
    );
  }

  function handleSaveProgress() {
    const stateToSave: SavedTierListState = {
      itemLocations,
      items,
      tiers,
    };

    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    setStatusMessage("Progreso guardado en este navegador.");
  }

  function handleLoadProgress() {
    const savedValue = localStorage.getItem(storageKey);

    if (!savedValue) {
      setStatusMessage("No hay progreso guardado en este navegador.");
      return;
    }

    try {
      const parsedValue: unknown = JSON.parse(savedValue);

      if (!isSavedTierListState(parsedValue)) {
        setStatusMessage("El progreso guardado no tiene un formato valido.");
        return;
      }

      setItems(parsedValue.items);
      setTiers(parsedValue.tiers);
      setItemLocations(parsedValue.itemLocations);
      customTierCountRef.current = getNextCustomTierCount(parsedValue.tiers);
      setSelectedTemplateId("");
      setStatusMessage("Progreso cargado.");
    } catch {
      setStatusMessage("No se pudo cargar el progreso guardado.");
    }
  }

  function handleResetTierList() {
    if (
      hasExistingProgress() &&
      !window.confirm(
        "Reiniciar la tierlist borrara los cambios actuales de esta pantalla. ¿Quieres continuar?",
      )
    ) {
      return;
    }

    setItems(initialItems);
    setTiers(initialTiers);
    setItemLocations(getResetLocations());
    setActiveItemId(null);
    setSelectedTemplateId("");
    customTierCountRef.current = 0;
    setStatusMessage("Tierlist reiniciada.");
  }

  function handleTemplateChange(templateId: string) {
    if (!templateId) {
      setSelectedTemplateId("");
      return;
    }

    const template = templates.find((templateItem) => templateItem.id === templateId);

    if (!template) {
      return;
    }

    if (
      hasExistingProgress() &&
      !window.confirm(
        "Cargar una plantilla reemplazara la tierlist actual. ¿Quieres continuar?",
      )
    ) {
      return;
    }

    const templateItems = buildTemplateItems(template);

    setItems(templateItems);
    setTiers(initialTiers);
    setItemLocations(buildTrayLocations(templateItems));
    setActiveItemId(null);
    setSelectedTemplateId(templateId);
    customTierCountRef.current = 0;
    setStatusMessage(`Plantilla "${template.name}" cargada.`);
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
        <section className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-xl shadow-slate-200">
          <div className="mb-3 flex flex-col gap-3 rounded-md bg-slate-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Mi nueva tier list</p>
              <p className="text-sm text-slate-400">
                Borrador local, listo para organizar tus elementos.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
              <label
                htmlFor="tier-template-selector"
                className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300"
              >
                Plantilla
                <select
                  id="tier-template-selector"
                  value={selectedTemplateId}
                  onChange={(event) => handleTemplateChange(event.target.value)}
                  className="h-10 rounded-md border border-white/15 bg-slate-800 px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition hover:bg-slate-700 focus:border-amber-300"
                >
                  <option value="">Elegir plantilla</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={handleSaveProgress}
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 bg-slate-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 sm:h-10"
              >
                Guardar progreso
              </button>
              <button
                type="button"
                onClick={handleLoadProgress}
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 bg-slate-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 sm:h-10"
              >
                Cargar progreso
              </button>
              <button
                type="button"
                onClick={handleResetTierList}
                className="inline-flex h-11 items-center justify-center rounded-md border border-rose-300/40 bg-rose-500/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 sm:h-10"
              >
                Reiniciar tierlist
              </button>
              <button
                type="button"
                onClick={handleAddTier}
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 bg-slate-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 sm:h-10"
              >
                Agregar tier
              </button>
              <span className="inline-flex h-11 items-center justify-center rounded-md bg-white px-3 text-xs font-bold uppercase tracking-wide text-slate-950 sm:h-10">
                Arrastra y suelta
              </span>
              <button
                type="button"
                onClick={handleExportImage}
                disabled={isExporting}
                className="inline-flex h-11 items-center justify-center rounded-md bg-amber-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10"
              >
                {isExporting ? "Exportando..." : "Exportar como imagen"}
              </button>
            </div>
          </div>
          <div className="mb-3 grid gap-2 rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
            <p>Arrastra tarjetas desde la bandeja hacia cualquier tier.</p>
            <p>Sube imagenes locales para crear tarjetas nuevas.</p>
            <p>Exporta el ranking como PNG cuando este listo.</p>
            <p>Guarda el progreso localmente en este navegador.</p>
          </div>
          {statusMessage ? (
            <p className="mb-3 rounded-md border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300">
              {statusMessage}
            </p>
          ) : null}

          <div
            ref={exportRef}
            data-testid="tierlist-export-area"
            className="grid gap-3"
          >
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
