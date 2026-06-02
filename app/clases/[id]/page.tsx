import { notFound } from "next/navigation";
import Link from "next/link";
import { clasesDetailsMap } from "@/lib/clasesDetails";

export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
    { id: "8" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const sessionNum = parseInt(resolvedParams.id, 10);
  const session = clasesDetailsMap[sessionNum];

  if (!session) {
    return {
      title: "Sesión no encontrada",
    };
  }

  return {
    title: `${session.title} | Bitácora de Clases`,
    description: session.subtitle,
  };
}

export default async function ClaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const sessionNum = parseInt(resolvedParams.id, 10);
  const session = clasesDetailsMap[sessionNum];

  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-24 pt-28">
      <div className="section-container max-w-4xl">
        {/* Back Button */}
        <Link
          href="/clases"
          className="link inline-flex items-center gap-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
        >
          ← Volver a Sesiones
        </Link>

        {/* Title Header */}
        <header className="mt-8 border-b border-[var(--color-border)] pb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Semana {session.week}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl text-[var(--color-foreground)]">
            {session.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Calendario académico: {session.date}
          </p>
          <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {session.subtitle}
          </p>
        </header>

        {/* Sections Content */}
        <main className="mt-10 space-y-12">
          {session.sections.map((section, idx) => (
            <article key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--color-foreground)] sm:text-2xl">
                {section.title}
              </h2>
              <p className="text-base leading-relaxed text-[var(--color-muted)] sm:text-lg whitespace-pre-line">
                {section.text}
              </p>
              {section.code && (
                <div className="relative mt-4 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <pre className="font-mono text-sm leading-relaxed overflow-x-auto text-cyan-300 no-scrollbar">
                    <code>{section.code}</code>
                  </pre>
                </div>
              )}
            </article>
          ))}
        </main>

        {/* Related Projects */}
        {session.projects && session.projects.length > 0 && (
          <footer className="mt-16 border-t border-[var(--color-border)] pt-8">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
              Recursos y Proyectos Relacionados
            </h3>
            <ul className="mt-4 space-y-3">
              {session.projects.map((proj, idx) => (
                <li key={idx}>
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link inline-flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 hover:underline"
                  >
                    🚀 {proj.name}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </div>
    </div>
  );
}
