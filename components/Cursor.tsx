"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useApp } from "@/contexts/AppContext";

export default function Cursor() {
  const { isDesktop, isLoading } = useApp();
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !isDesktop) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    cursor.classList.remove("hidden");
    follower.classList.remove("hidden");

    const move = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "none" });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: "none",
      });
    };

    const hover = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.3 });
      gsap.to(follower, { scale: 2.5, duration: 0.3 });
    };

    const unhover = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    };

    document.addEventListener("mousemove", move);
    const links = document.querySelectorAll(".link");
    links.forEach((el) => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", unhover);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", hover);
        el.removeEventListener("mouseleave", unhover);
      });
    };
  }, [isDesktop, isLoading]);

  if (!isDesktop) return null;

  return (
    <>
      <div ref={cursorRef} className="cursor-dot hidden" />
      <div ref={followerRef} className="cursor-follower hidden" />
    </>
  );
}
