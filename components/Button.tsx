import Link from "next/link";
import { cn } from "@/utils/cn";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

export default function Button({
  href,
  children,
  className,
  external,
}: ButtonProps) {
  const classes = cn(
    "link inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-200 transition hover:border-violet-400 hover:bg-violet-500/20 hover:shadow-[0_0_30px_-8px_rgba(139,92,246,0.5)]",
    className,
  );

  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
