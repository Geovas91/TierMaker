import type { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Panel administrativo",
  description: "Panel administrativo privado de TierMaker.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            TierMaker
          </Link>
          <Link
            href="/cuenta"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Mi cuenta
          </Link>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <AdminDashboard />
        </div>
      </section>
    </main>
  );
}
