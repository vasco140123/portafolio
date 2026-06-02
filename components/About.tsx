"use client";

import { profile } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function About() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-24 border-t border-[var(--color-border)] py-20 sm:py-28"
    >
      <div className="section-container">
        <p data-reveal className="text-sm font-medium uppercase tracking-widest text-violet-400">
          Sobre mí
        </p>
        <h2 data-reveal className="section-title mt-3">
          Tecnologías de la Información con enfoque práctico
        </h2>
        <div className="mt-8 space-y-6">
          {profile.aboutParagraphs.map((paragraph, index) => (
            <p
              key={index}
              data-reveal
              className="text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
