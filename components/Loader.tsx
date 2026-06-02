"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: "power2.inOut" },
      );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-background)]"
      role="status"
      aria-label="Cargando portafolio"
    >
      <p
        ref={textRef}
        className="text-sm font-medium uppercase tracking-[0.35em] text-violet-400"
      >
        Cargando
      </p>
      <p className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="gradient-text">Portafolio</span>
      </p>
      <div className="mt-10 h-0.5 w-48 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-violet-500 to-cyan-400"
        />
      </div>
    </div>
  );
}
