"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";

type ExperienceImageProps = {
  src: string;
  alt: string;
  title: string;
  description: string;
};

export default function ExperienceImage({
  src,
  alt,
  title,
  description,
}: ExperienceImageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (!cardRef.current || !imageRef.current) return;
    gsap.to(imageRef.current, {
      scale: 1.06,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(cardRef.current, {
      boxShadow: "0 0 60px -12px rgba(139, 92, 246, 0.55)",
      borderColor: "rgba(139, 92, 246, 0.5)",
      duration: 0.4,
    });
  };

  const onLeave = () => {
    if (!cardRef.current || !imageRef.current) return;
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(cardRef.current, {
      boxShadow: "0 0 0px transparent",
      borderColor: "rgba(42, 42, 58, 1)",
      duration: 0.4,
    });
  };

  return (
    <article
      ref={cardRef}
      className={cn(
        "link group relative w-full overflow-hidden rounded-2xl border border-[var(--color-border)]",
        "bg-[var(--color-surface)] transition-shadow",
      )}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        ref={imageRef}
        className="relative aspect-[16/10] w-full min-h-[280px] overflow-hidden sm:min-h-[360px] md:aspect-[21/9] md:min-h-[420px] lg:min-h-[480px]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-violet-600/0 transition-colors duration-500 group-hover:bg-violet-600/15" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10">
        <h3 className="text-2xl font-semibold sm:text-3xl md:text-4xl">{title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base md:text-lg">
          {description}
        </p>
      </div>
    </article>
  );
}
