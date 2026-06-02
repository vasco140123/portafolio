"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ClasesCTA() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-24 border-t border-[var(--color-border)] py-16 sm:py-20 bg-gradient-to-b from-violet-600/5 via-transparent to-transparent"
    >
      <div className="section-container">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 to-indigo-950/30 p-8 sm:p-10 md:p-12 hover:border-violet-500/55 hover:shadow-[0_0_50px_-10px_rgba(139,92,246,0.3)] transition-all duration-500 group"
        >
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl group-hover:bg-violet-600/30 transition-colors duration-500" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-2xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/20">
                ⭐ Bitácora Académica
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ruta de Aprendizaje
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
                Explora el registro detallado de las primeras 8 semanas académicas del curso de desarrollo web. Revisa contenidos teóricos, objetivos pedagógicos y ejemplos prácticos de programación Backend con PHP, arquitectura MVC y Laravel.
              </p>
            </div>
            <Link
              href="/clases"
              className="link inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition duration-300"
            >
              Explorar Clases →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
