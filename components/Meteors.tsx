"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

type MeteorStyle = {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
};

export default function Meteors({ count = 12 }: { count?: number }) {
  const [meteors, setMeteors] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    setMeteors(
      Array.from({ length: count }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${4 + Math.random() * 4}s`,
      })),
    );
  }, [count]);

  if (meteors.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {meteors.map((style, i) => (
        <span
          key={i}
          className={cn(
            "meteor absolute h-0.5 w-0.5 rotate-[215deg] rounded-full bg-slate-400 shadow-[0_0_0_1px_#ffffff10]",
          )}
          style={style}
        />
      ))}
    </div>
  );
}
