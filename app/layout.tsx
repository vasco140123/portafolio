import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import ClientShell from "@/components/ClientShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vasco Qori Ramos Mercado | Portafolio",
  description:
    "Portafolio de Vasco Qori Ramos Mercado — Ingeniería de Sistemas UNCP. Desarrollo web, BI y análisis de datos.",
  openGraph: {
    title: "Vasco Qori Ramos Mercado | Portafolio",
    description: "Estudiante de Ingeniería de Sistemas — UNCP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />
        </div>
        <ClientShell>
          <Navbar />
          <main>{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
