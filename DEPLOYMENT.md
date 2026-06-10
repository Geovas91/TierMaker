# Despliegue beta de TierMaker

Esta guia describe la preparacion y el despliegue de TierMaker en un entorno
de produccion. El proyecto usa Next.js App Router, Supabase y una ruta de
servidor para el panel administrativo, por lo que necesita un entorno capaz de
ejecutar Node.js de forma persistente.

## Estado de preparacion

Antes de desplegar:

```bash
npm ci
npm run lint
npm run build
```

El proyecto requiere Node.js `20.9.0` o posterior. Para la beta se recomienda
usar una version LTS compatible con ese requisito.

Checklist:

- El repositorio no debe contener `.env.local` ni claves reales.
- Las dos migraciones de `supabase/migrations` deben estar aplicadas.
- Email/password y Google OAuth deben estar configurados en Supabase.
- La URL publica definitiva debe estar configurada en Supabase y en
  `NEXT_PUBLIC_SITE_URL`.
- El dominio debe usar HTTPS. El portapapeles para copiar imagenes requiere un
  contexto seguro en navegadores compatibles.
- Debe comprobarse manualmente login, guardado, publicacion, feedback y acceso
  administrativo despues del despliegue.

## Configuracion de GitHub

1. Crea un repositorio privado o publico en GitHub.
2. Sube las ramas necesarias. La rama de produccion recomendada es `main`.
3. Confirma que `.gitignore` excluye `.env*`, excepto `.env.example`.
4. No agregues claves de Supabase a archivos, commits, issues o pull requests.
5. Activa proteccion para `main` si colaboran varias personas:
   - Pull request obligatorio.
   - Lint y build como verificaciones requeridas.
   - Bloqueo de pushes forzados.
6. Conecta el repositorio desde Vercel o clona el repositorio por SSH en el
   servidor DonWeb.

Ejemplo inicial si el repositorio aun no tiene remoto:

```bash
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

El repositorio actual ya puede usar un remoto `origin`; revisalo con:

```bash
git remote -v
```

## Configuracion de Supabase

1. Crea o selecciona el proyecto Supabase de produccion.
2. Abre SQL Editor y aplica, en este orden:
   - `supabase/migrations/20260609_create_tier_lists.sql`
   - `supabase/migrations/20260610_create_feedback.sql`
3. Confirma que Row Level Security esta habilitado en `tier_lists` y
   `feedback`.
4. Verifica las politicas:
   - Cada usuario administra solamente sus tierlists.
   - Solo las tierlists con `is_public = true` tienen lectura publica.
   - Cualquier visitante puede enviar feedback.
   - El feedback no tiene lectura publica.
5. En Authentication, configura email/password segun la politica del proyecto.
6. Para Google OAuth:
   - Activa el proveedor Google en Supabase.
   - Configura Client ID y Client Secret exclusivamente en Supabase.
   - Agrega el callback de Supabase a Google Cloud.
7. En Authentication > URL Configuration:
   - Define la URL de produccion como Site URL.
   - Agrega las URLs de redireccion necesarias, incluyendo
     `https://TU-DOMINIO/crear`.
   - Si usas previews de Vercel, agrega solamente los patrones de preview que
     decidas autorizar.
8. Copia Project URL, anon key y service role key desde Supabase. Guarda la
   service role key solo como secreto del servidor.

## Variables de entorno

Copia `.env.example` a `.env.local` solo para desarrollo. En produccion usa el
gestor de secretos del proveedor.

| Variable | Obligatoria | Exposicion | Uso |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Si | Navegador y servidor | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Si | Navegador y servidor | Clave anonima protegida por RLS. No es la service role key. |
| `NEXT_PUBLIC_SITE_URL` | Si en produccion | Navegador/build | URL HTTPS canonica, sin ruta final. Se usa en metadata, sitemap y robots. |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Si para `/admin` | Publica | Correos administradores separados por comas. La autorizacion se valida tambien en el endpoint. |
| `SUPABASE_SERVICE_ROLE_KEY` | Si para `/admin` | Solo servidor | Permite obtener conteos globales y feedback. Nunca debe llevar prefijo `NEXT_PUBLIC_`. |

Ejemplo sin valores reales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=valor-publico-anon
NEXT_PUBLIC_SITE_URL=https://tiermaker.example.com
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
SUPABASE_SERVICE_ROLE_KEY=secreto-solo-servidor
```

Notas de seguridad:

- No reutilices la service role key como anon key.
- No expongas `SUPABASE_SERVICE_ROLE_KEY` al navegador.
- Las variables `NEXT_PUBLIC_*` quedan incluidas en el codigo cliente cuando
  son utilizadas desde componentes del navegador; no deben contener secretos.
- Cambiar variables en el proveedor requiere un nuevo build/despliegue.

## Comandos de produccion

Instalacion reproducible:

```bash
npm ci
```

Build:

```bash
npm run build
```

Inicio:

```bash
npm run start
```

El proceso usa el puerto indicado en `PORT` cuando el proveedor lo establece.
Para una instalacion propia se puede usar, por ejemplo:

```bash
PORT=3000 npm run start
```

## Despliegue en Vercel

1. Importa el repositorio GitHub desde el panel de Vercel.
2. Vercel debe detectar automaticamente Next.js.
3. Usa el directorio raiz del repositorio.
4. Conserva los valores predeterminados:
   - Install Command: `npm install` o `npm ci` si lo configuras manualmente.
   - Build Command: `npm run build`.
   - Output Directory: valor administrado por Next.js/Vercel; no uses `out`.
5. Agrega todas las variables anteriores en Project Settings > Environment
   Variables.
6. Marca `SUPABASE_SERVICE_ROLE_KEY` como variable sensible y asignala solo a
   los entornos que realmente necesiten el panel administrativo.
7. Configura valores separados para Production, Preview y Development cuando
   corresponda.
8. Despliega y conecta el dominio personalizado.
9. Actualiza `NEXT_PUBLIC_SITE_URL` y la configuracion URL/OAuth de Supabase con
   el dominio final. Vuelve a desplegar despues del cambio.

Vercel ejecuta las rutas de servidor de Next.js como funciones; no es necesario
ejecutar manualmente `npm run start` en este proveedor.

## Despliegue en DonWeb

TierMaker no debe desplegarse como sitio estatico ni en un plan que solo sirva
HTML/PHP. Necesita un producto DonWeb con Node.js persistente, por ejemplo Node
Hosting, CloudPanel con sitio Node.js o Cloud Server.

Flujo recomendado en CloudPanel/Cloud Server:

1. Crea un sitio Node.js para el dominio y selecciona Node.js `20.9.0` o una
   version posterior compatible.
2. Configura DNS y un certificado HTTPS.
3. Accede por SSH con el usuario del sitio.
4. Clona el repositorio en el directorio asignado:

```bash
git clone https://github.com/USUARIO/REPOSITORIO.git
cd REPOSITORIO
npm ci
npm run build
```

5. Configura las variables en el panel del servicio o en un archivo protegido
   fuera del control de versiones. Restringe sus permisos.
6. Ejecuta la aplicacion con un administrador de procesos como PM2:

```bash
PORT=3000 pm2 start npm --name tiermaker -- start
pm2 save
```

7. Configura Nginx/CloudPanel para enviar el dominio HTTPS al puerto interno de
   la aplicacion.
8. Tras cada despliegue:

```bash
git pull --ff-only
npm ci
npm run build
pm2 restart tiermaker --update-env
```

No abras el puerto interno de Node directamente a Internet si Nginx actua como
proxy. Verifica tambien limites de memoria: la exportacion PNG y las imagenes
base64 pueden consumir memoria considerable con tierlists grandes.

## Verificacion posterior al despliegue

Revisa al menos:

- `/`, `/crear`, `/explorar`, `/feedback`, `/privacidad` y `/terminos`.
- Registro, inicio y cierre de sesion.
- Google OAuth y redireccion a `/crear`.
- Guardar/cargar una tierlist privada.
- Publicar una tierlist y abrir `/tierlist/[id]` sin sesion.
- Arrastrar tarjetas entre bandeja y tiers en escritorio y movil.
- Exportar PNG, copiar imagen y compartir URL bajo HTTPS.
- Enviar feedback y confirmar que aparece en `/admin`.
- Acceso denegado a `/admin` con una cuenta no autorizada.
- `https://TU-DOMINIO/robots.txt` y `/sitemap.xml`.

## Actualizacion y rollback

Antes de actualizar produccion:

```bash
npm ci
npm run lint
npm run build
```

En Vercel, utiliza el historial de deployments para volver a una version
anterior. En DonWeb, conserva tags o commits estables en Git y vuelve al commit
anterior antes de ejecutar `npm ci`, `npm run build` y reiniciar PM2.

Nunca hagas rollback de codigo sin considerar si una migracion de base de datos
introdujo cambios incompatibles.
