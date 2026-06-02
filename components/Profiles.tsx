import { socialLinks } from "@/lib/data";
import GithubIcon from "@/components/icons/GithubIcon";
import MailIcon from "@/components/icons/MailIcon";
import { cn } from "@/utils/cn";

const icons = {
  github: GithubIcon,
  mail: MailIcon,
} as const;

export default function Profiles({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-4 sm:gap-5", className)}>
      {socialLinks.map((item) => {
        const Icon = icons[item.icon];
        const isGithub = item.icon === "github";

        return (
          <li key={item.name}>
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cn(
                "link flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border transition-all duration-300",
                isGithub
                  ? "border-cyan-500/40 bg-cyan-950/15 text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 btn-animated-github"
                  : "border-violet-500/40 bg-violet-950/15 text-violet-400 hover:border-violet-400 hover:text-violet-300 hover:bg-violet-950/30 btn-animated-mail",
              )}
              aria-label={item.name}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
