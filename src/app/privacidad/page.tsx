import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Consulta como TierMaker puede recopilar, utilizar y almacenar datos de usuarios.",
  alternates: {
    canonical: "/privacidad",
  },
  openGraph: {
    title: "Aviso de privacidad | TierMaker",
    description:
      "Consulta como TierMaker puede recopilar, utilizar y almacenar datos de usuarios.",
    url: "/privacidad",
  },
};

const sections = [
  {
    title: "Datos que podemos recopilar",
    content:
      "TierMaker puede almacenar la informacion necesaria para ofrecer sus funciones, como datos de cuenta, tierlists, imagenes incluidas en ellas y comentarios enviados mediante el formulario de feedback. No vendemos tu informacion personal.",
  },
  {
    title: "Cuenta y correo electronico",
    content:
      "Si creas una cuenta o inicias sesion, Supabase Auth puede procesar tu correo electronico, identificador de usuario y datos basicos proporcionados por el proveedor de acceso, como Google. Esta informacion se utiliza para autenticarte y asociar tus tierlists con tu cuenta.",
  },
  {
    title: "Imagenes subidas",
    content:
      "Las imagenes que seleccionas se procesan en el navegador para crear elementos de tu tierlist. Si guardas la tierlist localmente, pueden quedar almacenadas en el almacenamiento de tu navegador. Si guardas la tierlist en tu cuenta, las imagenes incluidas en sus datos pueden enviarse a Supabase. Evita subir imagenes sensibles o que no tengas derecho a utilizar.",
  },
  {
    title: "Tierlists publicas",
    content:
      "Las tierlists son privadas de forma predeterminada. Cuando eliges marcarlas como publicas y guardas el cambio, su titulo, contenido, imagenes y el identificador de su creador pueden ser visibles para cualquier persona mediante las paginas publicas, perfiles y seccion Explorar.",
  },
  {
    title: "Cookies y localStorage",
    content:
      "TierMaker y Supabase pueden utilizar almacenamiento del navegador para mantener la sesion y las funciones de autenticacion. El editor tambien utiliza localStorage cuando eliges guardar progreso localmente. TierMaker no incorpora actualmente herramientas propias de analitica o seguimiento publicitario.",
  },
  {
    title: "Contacto y feedback",
    content:
      "Si envias feedback, podemos almacenar el mensaje y, si decides proporcionarlos, tu nombre y correo electronico. Estos datos se utilizan para revisar sugerencias, responder consultas y mejorar la plataforma.",
  },
  {
    title: "Tus decisiones",
    content:
      "Puedes mantener tus tierlists privadas, evitar proporcionar datos opcionales en el formulario de feedback y borrar el progreso local desde la configuracion de tu navegador. Para solicitudes relacionadas con tus datos, utiliza la pagina de feedback e incluye un correo de contacto.",
  },
];

export default function PrivacyPage() {
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
              Aviso de privacidad
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              Este aviso explica de forma sencilla como TierMaker puede tratar
              la informacion necesaria para ofrecer la plataforma.
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
