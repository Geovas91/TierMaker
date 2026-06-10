import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terminos de uso",
  description:
    "Consulta las reglas basicas para utilizar TierMaker y compartir contenido.",
  alternates: {
    canonical: "/terminos",
  },
  openGraph: {
    title: "Terminos de uso | TierMaker",
    description:
      "Consulta las reglas basicas para utilizar TierMaker y compartir contenido.",
    url: "/terminos",
  },
};

const sections = [
  {
    title: "Aceptacion de los terminos",
    content:
      "Al utilizar TierMaker aceptas estas condiciones basicas. Si no estas de acuerdo, no debes utilizar la plataforma ni publicar contenido mediante ella.",
  },
  {
    title: "Responsabilidad por el contenido",
    content:
      "Eres responsable de los textos, imagenes, rankings y demas contenido que subas o guardes. Debes contar con los permisos o derechos necesarios y asegurarte de que tu contenido no perjudique a otras personas ni infrinja derechos de autor, privacidad u otras normas aplicables.",
  },
  {
    title: "Compartir tierlists publicas",
    content:
      "Las tierlists permanecen privadas salvo que las marques como publicas y guardes ese cambio. Al publicar una tierlist aceptas que su titulo, contenido, imagenes y el identificador de su creador puedan mostrarse y compartirse mediante enlaces, perfiles y la seccion Explorar.",
  },
  {
    title: "Contenido prohibido",
    content:
      "No debes utilizar TierMaker para publicar contenido ilegal, amenazante, fraudulento, difamatorio, discriminatorio, sexualmente explotador, que promueva violencia, que revele datos personales sin autorizacion o que infrinja derechos de terceros. Tampoco se permite intentar abusar, interrumpir o acceder sin permiso a la plataforma.",
  },
  {
    title: "Uso de cuentas",
    content:
      "Eres responsable de mantener segura tu cuenta y de las acciones realizadas desde ella. Debes proporcionar informacion valida al registrarte y notificarnos mediante la pagina de feedback si detectas un acceso no autorizado o un problema relacionado con tu cuenta.",
  },
  {
    title: "Disponibilidad del servicio",
    content:
      "TierMaker se ofrece segun disponibilidad. No garantizamos que el servicio sea continuo, que este libre de errores o que todos los datos esten siempre disponibles. Podemos realizar mantenimiento, modificar funciones o suspender temporalmente partes de la plataforma.",
  },
  {
    title: "Moderacion y cambios",
    content:
      "Podemos retirar contenido o limitar cuentas cuando sea necesario para proteger la plataforma, cumplir obligaciones legales o responder a usos indebidos. Estos terminos pueden actualizarse conforme evolucione TierMaker; la fecha de esta pagina indicara la version vigente.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
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

      <article className="px-6 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="border-b border-slate-200 pb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Informacion legal
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Terminos de uso
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              Estas condiciones describen las reglas basicas para crear,
              guardar y compartir contenido en TierMaker.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Ultima actualizacion: 10 de junio de 2026.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {sections.map((section) => (
              <section key={section.title} className="py-8">
                <h2 className="text-2xl font-semibold text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
