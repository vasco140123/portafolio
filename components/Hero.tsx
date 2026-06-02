"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Typed from "typed.js";
import { profile, typedStrings } from "@/lib/data";
import { useStaggerMount } from "@/hooks/useStaggerMount";
import Profiles from "@/components/Profiles";
import Button from "@/components/Button";

export default function Hero() {
  const sectionRef = useStaggerMount<HTMLElement>();
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = typedRef.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      el.textContent = typedStrings[0];
      return;
    }

    const typed = new Typed(el, {
      strings: [...typedStrings],
      typeSpeed: 45,
      startDelay: 400,
      backSpeed: 40,
      backDelay: 6000,
      loop: true,
    });

    return () => typed.destroy();
  }, []);

  const [firstName, ...rest] = profile.fullName.split(" ");

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="scroll-mt-24 pb-16 pt-28 sm:pb-20 sm:pt-32"
    >
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="staggered-reveal text-sm font-medium uppercase tracking-widest text-violet-400">
              Hola, mi nombre es
            </p>
            <h1 className="staggered-reveal mt-3 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">{firstName}</span>
              {rest.length > 0 && (
                <>
                  <br />
                  <span>{rest.join(" ")}</span>
                </>
              )}
            </h1>
            <p className="staggered-reveal mt-4 min-h-[2.5rem] text-lg text-[var(--color-muted)] sm:text-xl">
              <span ref={typedRef} className="typed-cursor text-violet-300" />
            </p>
            <p className="staggered-reveal mt-2 text-sm text-[var(--color-muted)]">
              {profile.role}
            </p>
            <Profiles className="staggered-reveal mt-6" />
            <div className="staggered-reveal mt-8">
              <Button href="/#contact">Conversemos →</Button>
            </div>
          </div>

          <div className="staggered-reveal relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="hero-glow absolute -inset-4 rounded-3xl" />
            <div className="glass-card relative overflow-hidden p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--color-surface-elevated)]">
                <Image
                  src={profile.profileImage}
                  alt={`Foto de ${profile.fullName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="staggered-reveal mt-14 flex justify-center">
          <Link
            href="#about"
            className="link flex flex-col items-center gap-2 text-xs text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
          >
            <span>Explorar</span>
            <span className="animate-bounce text-lg" aria-hidden>
              ↓
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
