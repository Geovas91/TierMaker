import type { Metadata } from "next";
import Link from "next/link";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description:
    "Administra tu perfil y revisa la informacion de tu cuenta de TierMaker.",
  alternates: {
    canonical: "/cuenta",
  },
  openGraph: {
    title: "Mi cuenta | TierMaker",
    description:
      "Administra tu perfil y tus datos de cuenta en TierMaker.",
    url: "/cuenta",
  },
  twitter: {
    card: "summary",
    title: "Mi cuenta | TierMaker",
    description: "Administra tu perfil y tus datos de cuenta en TierMaker.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
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
            Ir al editor
          </Link>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <AccountView />
        </div>
      </section>
    </main>
  );
}
