"use client";

import { certifications } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Certifications() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="scroll-mt-24 border-t border-[var(--color-border)] py-20 sm:py-28"
    >
      <div className="section-container">
        <div data-reveal>
          <h2 className="section-title">Certificaciones</h2>
          <p className="section-subtitle">
            Tarjetas minimalistas listas para tus certificados reales.
          </p>
        </div>

        <ul className="mt-10 space-y-3">
          {certifications.map((cert) => (
            <li
              key={cert.id}
              data-reveal
              className="glass-card flex flex-col gap-3 p-5 transition hover:border-violet-500/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-sm font-bold text-violet-300"
                  aria-hidden
                >
                  ✓
                </span>
                <div>
                  <h3 className="font-medium">{cert.title}</h3>
                  <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                    {cert.issuer}
                  </p>
                </div>
              </div>
              <span className="text-sm text-[var(--color-muted)] sm:text-right">
                {cert.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
