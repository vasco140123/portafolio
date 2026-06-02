"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

type Project = {
  id: number;
  title: string;
  description: string;
  tags: readonly string[];
  gradient: string;
  github?: string;
  image?: string;
};

export default function ProjectTile({ project }: { project: Project }) {
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tileRef.current;
    if (!el || window.innerWidth < 768) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    let tiltInstance: { destroy: () => void } | undefined;

    import("vanilla-tilt").then(({ default: VanillaTilt }) => {
      if (!tileRef.current) return;
      VanillaTilt.init(tileRef.current, {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.12,
        scale: 1.02,
      });
      tiltInstance = (
        tileRef.current as HTMLDivElement & {
          vanillaTilt?: { destroy: () => void };
        }
      ).vanillaTilt;
    });

    return () => tiltInstance?.destroy();
  }, []);

  return (
    <article
      ref={tileRef}
      className={cn(
        "glass-card link group w-[min(90vw,28rem)] shrink-0 snap-center overflow-hidden sm:w-[420px]",
        "transition hover:border-cyan-500/30 flex flex-col h-[460px] sm:h-[480px]",
      )}
    >
      <div
        className={cn(
          "relative flex h-40 shrink-0 items-end bg-gradient-to-br p-5 sm:h-44 overflow-hidden",
          project.gradient,
        )}
      >
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover mix-blend-overlay opacity-60 transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 420px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/20 to-transparent" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-xl font-bold text-white backdrop-blur-sm sm:h-14 sm:w-14 sm:text-2xl">
          {String(project.id).padStart(2, "0")}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold sm:text-xl line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base line-clamp-4">
            {project.description}
          </p>
        </div>

        <div className="mt-4">
          <ul className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/40 px-2.5 py-0.5 text-xs text-[var(--color-muted)]"
              >
                {tag}
              </li>
            ))}
          </ul>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:border-violet-400 hover:bg-violet-500/20 hover:shadow-[0_0_20px_-6px_rgba(139,92,246,0.45)]"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Ver repositorio
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
