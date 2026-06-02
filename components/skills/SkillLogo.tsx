import Image from "next/image";
import { cn } from "@/utils/cn";

type SkillLogoProps = {
  name: string;
  slug: string;
  className?: string;
};

export function getSkillIconUrl(slug: string) {
  if (["java", "microsoftsqlserver", "powerbi"].includes(slug)) {
    return `/portafolio/img/skills/${slug}.svg`;
  }
  return `https://cdn.simpleicons.org/${slug}/e2e8f0`;
}

export default function SkillLogo({ name, slug, className }: SkillLogoProps) {
  const isLocal = ["java", "microsoftsqlserver", "powerbi"].includes(slug);

  return (
    <div
      className={cn(
        "skill-logo-card link flex shrink-0 flex-col items-center justify-center gap-3",
        "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-8 py-6",
        "backdrop-blur-sm transition duration-300",
        "hover:border-violet-500/50 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.45)]",
        className,
      )}
      title={name}
    >
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
        <Image
          src={getSkillIconUrl(slug)}
          alt={name}
          fill
          className={cn(
            "object-contain transition-all duration-300",
            isLocal && "brightness-[0.9] contrast-[0.2] invert-[0.95]"
          )}
          sizes="96px"
          unoptimized
        />
      </div>
      <span className="text-sm font-medium text-[var(--color-muted)] sm:text-base">
        {name}
      </span>
    </div>
  );
}
