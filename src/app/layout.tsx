import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "TierMaker",
  title: {
    default: "TierMaker | Crea y comparte tier lists",
    template: "%s | TierMaker",
  },
  description:
    "Crea, guarda, publica y explora tier lists visuales en espanol con TierMaker.",
  keywords: [
    "tier lists",
    "tier maker",
    "rankings",
    "listas de niveles",
    "crear tier list",
    "tier lists en espanol",
  ],
  authors: [{ name: "TierMaker" }],
  creator: "TierMaker",
  publisher: "TierMaker",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TierMaker | Crea y comparte tier lists",
    description:
      "Crea rankings visuales, guarda tus listas y comparte tier lists publicas con la comunidad.",
    url: "/",
    siteName: "TierMaker",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TierMaker | Crea y comparte tier lists",
    description:
      "Crea, guarda, publica y explora tier lists visuales en espanol.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
