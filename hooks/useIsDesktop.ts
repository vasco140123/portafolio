"use client";

import { useEffect, useState } from "react";

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => {
      const { innerWidth } = window;
      const isTouch =
        typeof window.orientation !== "undefined" ||
        navigator.userAgent.includes("IEMobile");
      setIsDesktop(innerWidth >= 768 && !isTouch);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isDesktop;
}
