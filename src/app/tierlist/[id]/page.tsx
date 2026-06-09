import Link from "next/link";
import { PublicTierListView } from "@/components/tierlist/PublicTierListView";

type PublicTierListPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicTierListPage({
  params,
}: PublicTierListPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            TierMaker
          </Link>
          <Link
            href="/crear"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Crear tierlist
          </Link>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <PublicTierListView id={id} />
        </div>
      </section>
    </main>
  );
}
