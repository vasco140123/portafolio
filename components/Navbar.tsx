"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between sm:h-[4.25rem]">
        <Link
          href="/"
          className="link flex items-center gap-0.5 text-base font-bold tracking-wider sm:text-lg"
        >
          <span className="logo-container flex">
            {"Portafolio".split("").map((char, i) => (
              <span
                key={i}
                className="logo-letter"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </span>
          <span className="logo-dot">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isClases = link.href === "/clases";
            const active = isClases
              ? pathname === "/clases"
              : isHome && link.href.startsWith("/#");

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    isClases
                      ? `link rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${
                          active
                            ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                            : "border border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/25 hover:text-white hover:border-violet-400 hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
                        }`
                      : `link rounded-lg px-3 py-2 text-sm transition-colors ${
                          active
                            ? "bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]"
                            : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                        }`
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menú</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-5 pb-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isClases = link.href === "/clases";
              const active = isClases
                ? pathname === "/clases"
                : isHome && link.href.startsWith("/#");

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={
                      isClases
                        ? `link block rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                            active
                              ? "bg-violet-600 text-white border border-violet-500/50"
                              : "border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-white"
                          }`
                        : "link block rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
