"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import SkillsMarquee from "@/components/skills/SkillsMarquee";

export default function Skills() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="scroll-mt-24 overflow-hidden border-t border-[var(--color-border)] py-20 sm:py-28"
    >
      <div className="section-container" data-reveal>
        <h2 className="section-title">Habilidades</h2>
        <p className="section-subtitle">
          Tecnologías y herramientas con las que trabajo.
        </p>
      </div>

      <div data-reveal className="relative left-1/2 mt-2 w-screen -translate-x-1/2">
        <SkillsMarquee />
      </div>
    </section>
  );
}
