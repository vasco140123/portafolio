"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ProjectTile from "@/components/projects/ProjectTile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const revealRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Check screen size
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const trackWidth = track.scrollWidth;
    const containerWidth = container.offsetWidth;
    const scrollAmount = trackWidth - containerWidth;

    if (scrollAmount <= 0) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top 80px",
          end: () => `+=${scrollAmount}`,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative scroll-mt-24 border-t border-[var(--color-border)] py-20 sm:py-28 overflow-hidden"
    >
      <div ref={revealRef} className="section-container mb-12">
        <div data-reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
            Proyectos
          </p>
          <h2 className="section-title mt-3">Mis proyectos</h2>
          <p className="section-subtitle">
            He desarrollado y colaborado en diversos proyectos tecnológicos. En desktop, desplázate verticalmente para ver el recorrido horizontal.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Track Wrapper */}
      <div className="w-full overflow-x-auto lg:overflow-x-visible no-scrollbar snap-x snap-mandatory pb-4">
        <div
          ref={trackRef}
          className="projects-track-inner flex gap-6 w-max ease-out"
          style={{ willChange: "transform" }}
        >
          {projects.map((project) => (
            <div key={project.id} className="snap-center">
              <ProjectTile project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
