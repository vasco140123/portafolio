import Meteors from "@/components/Meteors";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] py-8">
      <Meteors count={14} />
    </footer>
  );
}
