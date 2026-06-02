"use client";

import { useEffect, useRef } from "react";

export default function ProgressIndicator() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = height > 0 ? scrollTop / height : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${scrolled})`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="progress-track" aria-hidden>
      <div ref={progressRef} className="progress-bar" />
    </div>
  );
}
