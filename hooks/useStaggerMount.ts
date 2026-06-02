"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function useStaggerMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(".staggered-reveal");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      gsap.set(el, { opacity: 1 });
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 28 });

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5, clearProps: "opacity" })
        .to(
          items,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, clearProps: "opacity,transform" },
          "-=0.3",
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
