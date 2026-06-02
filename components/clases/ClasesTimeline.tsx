"use client";

import Link from "next/link";
import { clasesWeeks } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ClasesTimeline() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });

  return (
    <section ref={sectionRef} className="section-container mt-14">
      <ol className="relative border-l border-[var(--color-border)] pl-8 sm:pl-10">
        {clasesWeeks.map((entry) => (
          <li key={entry.week} data-reveal className="relative pb-12 last:pb-0">
            <span
              className="absolute -left-[2.05rem] flex h-8 w-8 items-center justify-center rounded-full border border-violet-500/50 bg-[var(--color-background)] text-xs font-bold text-violet-300 sm:-left-[2.35rem] sm:h-9 sm:w-9"
              aria-hidden
            >
              {entry.week}
            </span>
            <Link href={`/clases/${entry.week}`} className="group block">
              <article className="glass-card p-5 sm:p-6 transition duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_-8px_rgba(139,92,246,0.35)] hover:bg-[var(--color-surface-elevated)]/60">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-semibold group-hover:text-violet-300 transition-colors">
                    {entry.title}
                  </h2>
                  <span className="text-sm text-[var(--color-muted)]">
                    {entry.date}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                  {entry.content}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)]/50 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-2.5 py-0.5 text-xs font-medium text-violet-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-violet-400 group-hover:text-violet-300 group-hover:translate-x-1 transition flex items-center gap-1">
                    Ver sesión →
                  </span>
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
