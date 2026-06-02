"use client";

import { skills } from "@/lib/data";
import SkillLogo from "@/components/skills/SkillLogo";

function MarqueeRow({
  reverse = false,
  ariaHidden = false,
}: {
  reverse?: boolean;
  ariaHidden?: boolean;
}) {
  const items = [...skills, ...skills];

  return (
    <div
      className={`skills-marquee-row flex w-max gap-6 sm:gap-8 ${
        reverse ? "skills-marquee-reverse" : "skills-marquee-forward"
      }`}
      aria-hidden={ariaHidden}
    >
      {items.map((skill, index) => (
        <SkillLogo
          key={`${skill.slug}-${index}`}
          name={skill.name}
          slug={skill.slug}
          className="min-w-[9.5rem] sm:min-w-[11rem] md:min-w-[12.5rem]"
        />
      ))}
    </div>
  );
}

export default function SkillsMarquee() {
  return (
    <div className="skills-marquee-mask relative mt-12 w-full">
      <div className="flex flex-col gap-6 sm:gap-8">
        <div className="overflow-hidden">
          <MarqueeRow />
        </div>
        <div className="overflow-hidden">
          <MarqueeRow reverse ariaHidden />
        </div>
      </div>
    </div>
  );
}
