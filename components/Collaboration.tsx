"use client";

import { collaboration } from "@/lib/data";
import Button from "@/components/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Collaboration() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--color-border)] py-16 sm:py-20"
    >
      <div className="section-container">
        <div
          data-reveal
          className="glass-card flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10"
        >
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {collaboration.title}
            </h2>
            <p className="mt-2 max-w-xl text-[var(--color-muted)]">
              {collaboration.description}
            </p>
          </div>
          <Button href={collaboration.href}>{collaboration.cta} →</Button>
        </div>
      </div>
    </section>
  );
}
