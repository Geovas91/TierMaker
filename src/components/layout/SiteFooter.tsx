import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>TierMaker</p>
        <nav
          aria-label="Enlaces del pie de pagina"
          className="flex flex-wrap gap-x-5 gap-y-2"
        >
          <Link
            href="/feedback"
            className="font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Enviar feedback
          </Link>
          <Link
            href="/privacidad"
            className="font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Privacidad
          </Link>
          <Link
            href="/terminos"
            className="font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Terminos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
