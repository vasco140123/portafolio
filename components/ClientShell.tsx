"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AppContext } from "@/contexts/AppContext";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import ProgressIndicator from "@/components/ProgressIndicator";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState(isHome);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isHome) {
      setIsLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const delay = reduced ? 300 : 2200;

    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [isHome]);

  useEffect(() => {
    if (isLoading) return;

    document.body.classList.toggle("has-custom-cursor", isDesktop);

    const refresh = () => ScrollTrigger.refresh();
    const t1 = setTimeout(refresh, 100);
    const t2 = setTimeout(refresh, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [isLoading, isDesktop, pathname]);



  return (
    <AppContext.Provider value={{ isDesktop, isLoading }}>
      {!isLoading && <ProgressIndicator />}
      {isDesktop && !isLoading && <Cursor />}
      {isLoading && isHome ? <Loader /> : children}
    </AppContext.Provider>
  );
}
