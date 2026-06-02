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
    <ul className={cn("flex items-center gap-3", className)}>
      {socialLinks.map((item) => {
        const Icon = icons[item.icon];
        return (
          <li key={item.name}>
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="link flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] transition hover:border-violet-500/50 hover:text-violet-300"
              aria-label={item.name}
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
