"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ItemCard } from "./ItemCard";
import type { ContainerId, Tier, TierItem } from "./types";

type PublicTierListData = {
  itemLocations: Record<string, ContainerId>;
  items: TierItem[];
  tiers: Tier[];
  title?: string;
};

type PublicTierListRow = {
  data: unknown;
  id: string;
  title: string;
};

type PublicTierListViewProps = {
  id: string;
};

function isPublicTierListData(value: unknown): value is PublicTierListData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PublicTierListData>;

  return (
    Array.isArray(candidate.items) &&
    Array.isArray(candidate.tiers) &&
    Boolean(candidate.itemLocations) &&
    typeof candidate.itemLocations === "object"
  );
}

export function PublicTierListView({ id }: PublicTierListViewProps) {
  const [tierList, setTierList] = useState<PublicTierListRow | null>(null);
  const [message, setMessage] = useState("Cargando tierlist...");
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTierList() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("tier_lists")
          .select("id,title,data")
          .eq("id", id)
          .eq("is_public", true)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        if (error) {
          setMessage(error.message);
          return;
        }

        if (!data) {
          setMessage("Esta tierlist no esta disponible publicamente.");
          return;
        }

        setTierList(data as PublicTierListRow);
        setMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof Error) {
          setMessage(error.message);
        }
      }
    }

    fetchTierList();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const tierListData = isPublicTierListData(tierList?.data)
    ? tierList.data
    : null;

  const itemsByContainer = useMemo(() => {
    if (!tierListData) {
      return {};
    }

    const groups = tierListData.tiers.reduce<Record<string, TierItem[]>>(
      (currentGroups, tier) => {
        currentGroups[tier.id] = [];
        return currentGroups;
      },
      {},
    );

    tierListData.items.forEach((item) => {
      const location = tierListData.itemLocations[item.id];

      if (location && groups[location]) {
        groups[location].push(item);
      }
    });

    return groups;
  }, [tierListData]);

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

  if (message) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Tierlist</h1>
        <p className="mt-3 text-slate-600">{message}</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!tierList || !tierListData) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">
          No pudimos mostrar esta tierlist
        </h1>
        <p className="mt-3 text-slate-600">
          El contenido publico no tiene el formato esperado.
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            Tierlist publica
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">
            {tierList.title}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleExportImage}
          disabled={isExporting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? "Exportando..." : "Exportar PNG"}
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-xl shadow-slate-200">
        <div ref={exportRef} className="grid gap-3">
          {tierListData.tiers.map((tier) => (
            <section
              key={tier.id}
              className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-[6rem_1fr]"
            >
              <div
                className={`${tier.colorClassName} flex min-h-24 items-center justify-center px-4 text-3xl font-black text-slate-950 sm:min-h-28`}
              >
                {tier.label}
              </div>
              <div className="min-h-28 border-t border-slate-200 bg-slate-50 p-4 sm:border-l sm:border-t-0">
                {(itemsByContainer[tier.id] ?? []).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {(itemsByContainer[tier.id] ?? []).map((item) => (
                      <ItemCard
                        key={item.id}
                        title={item.title}
                        accentClassName={item.accentClassName}
                        imageUrl={item.imageUrl}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-16 items-center justify-center text-center text-sm font-semibold text-slate-400">
                    Sin items en este tier
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
