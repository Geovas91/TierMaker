import type { Metadata } from "next";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { AuthStatus } from "@/components/auth/AuthStatus";

export const metadata: Metadata = {
  title: "Crea y comparte tier lists",
  description:
    "Crea rankings visuales, organiza tus favoritos por niveles y comparte tier lists publicas con la comunidad.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TierMaker | Crea y comparte tier lists",
    description:
      "Crea rankings visuales, organiza tus favoritos y comparte tier lists publicas.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "TierMaker | Crea y comparte tier lists",
    description:
      "Crea rankings visuales, organiza tus favoritos y comparte tier lists publicas.",
  },
};

const tiers = [
  {
    label: "S",
    color: "bg-rose-500",
    items: ["Finales épicos", "Jefes memorables", "Bandas sonoras"],
  },
  {
    label: "A",
    color: "bg-amber-400",
    items: ["Modo historia", "Retos diarios"],
  },
  {
    label: "B",
    color: "bg-emerald-400",
    items: ["Mapas clásicos", "Skins"],
  },
  {
    label: "C",
    color: "bg-sky-400",
    items: ["Tutoriales"],
  },
];

const platformSteps = [
  "Crea listas por juegos, música, películas, comidas, equipos o cualquier tema.",
  "Ordena elementos en filas personalizadas con colores, nombres y criterios propios.",
  "Guarda tus mejores rankings y compártelos con tu comunidad cuando la plataforma evolucione.",
];

const features = [
  {
    title: "Editor visual",
    description:
      "Una experiencia preparada para arrastrar, organizar y comparar elementos de forma clara.",
  },
  {
    title: "Plantillas flexibles",
    description:
      "Estructura tier lists desde cero o parte de formatos reutilizables para tus categorías favoritas.",
  },
  {
    title: "Diseño compartible",
    description:
      "Listas limpias, responsivas y listas para mostrarse en redes, grupos o comunidades.",
  },
  {
    title: "Base lista para crecer",
    description:
      "Arquitectura simple en Next.js, preparada para integrar autenticación y Supabase más adelante.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-6 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-xl font-black tracking-tight">
              TierMaker
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/explorar"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Explorar
              </Link>
              <AuthStatus />
            </div>
          </header>

          <div className="grid min-h-[82vh] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Portal de tier lists en español
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
              TierMaker
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Crea rankings visuales, organiza tus favoritos por niveles y
              prepara listas fáciles de personalizar, guardar y compartir.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/crear"
                className="inline-flex h-12 items-center justify-center rounded-md bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Empezar proyecto
              </Link>
              <Link
                href="/explorar"
                className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
              >
                Explorar publicas
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-300/50">
              <div className="mb-3 flex items-center justify-between rounded-md bg-slate-900 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Ranking de favoritos
                  </p>
                  <p className="text-xs text-slate-400">
                    Borrador privado, listo para editar
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="space-y-2">
                {tiers.map((tier) => (
                  <div
                    key={tier.label}
                    className="grid min-h-20 grid-cols-[4.5rem_1fr] overflow-hidden rounded-md border border-white/10 bg-slate-900"
                  >
                    <div
                      className={`${tier.color} flex items-center justify-center text-2xl font-black text-slate-950`}
                    >
                      {tier.label}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 p-3">
                      {tier.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-white/10 bg-white px-3 py-2 text-sm font-medium text-slate-900"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Qué hace la plataforma
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Convierte opiniones en rankings visuales y fáciles de compartir.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {platformSteps.map((step, index) => (
              <article
                key={step}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-5 text-base leading-7 text-slate-600">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <AdPlaceholder />
        </div>
      </section>

      <section
        id="features"
        className="border-b border-slate-200 bg-white px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Funciones principales
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Una base moderna para construir el editor completo.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-6 h-1.5 w-14 rounded-full bg-rose-500" />
                <h3 className="text-lg font-semibold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
              Próximo paso
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Diseña la experiencia, valida el concepto y deja Supabase para la
              siguiente etapa.
            </h2>
          </div>
          <a
            href="/crear"
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Crear mi primera tier list
          </a>
        </div>
      </section>
    </main>
  );
}
