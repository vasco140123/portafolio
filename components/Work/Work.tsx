"use client";

import { workExperience } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ExperienceImage from "@/components/Work/ExperienceImage";

export default function Work() {
  const sectionRef = useScrollReveal<HTMLElement>();

  const withImages = workExperience.filter(
    (item): item is (typeof workExperience)[number] & { image: string } =>
      "image" in item && Boolean(item.image),
  );
  const withoutImages = workExperience.filter((item) => !("image" in item));

  return (
    <section
      id="work"
      ref={sectionRef}
      className="scroll-mt-24 border-t border-[var(--color-border)] py-20 sm:py-28"
    >
      <div className="section-container">
        <p data-reveal className="text-sm font-medium uppercase tracking-widest text-cyan-400">
          Experiencia
        </p>
        <h2 data-reveal className="section-title mt-3">
          Trayectoria
        </h2>
        <p data-reveal className="section-subtitle mb-8">
          Experiencia y proyectos que respaldan mi perfil técnico.
        </p>
        <div className="max-w-4xl space-y-4 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          <p data-reveal>
            He desarrollado proyectos enfocados en el análisis, diseño e implementación de soluciones tecnológicas orientadas a la mejora de procesos y gestión de información. Mi experiencia incluye el desarrollo de sistemas en Java con Apache NetBeans, administración y modelado de bases de datos en SQL Server, además de la creación de aplicaciones y propuestas web orientadas a la automatización y visualización de datos.
          </p>
          <p data-reveal>
            También he trabajado en proyectos de investigación y casos de estudio relacionados con Gobierno Digital, Continuidad TI, dashboards analíticos y sistemas de gestión, aplicando metodologías de análisis, arquitectura de software y estructuración de documentación técnica.
          </p>
          <p data-reveal>
            Actualmente me encuentro ampliando mis conocimientos en desarrollo web moderno, integración de datos y soluciones inteligentes orientadas a la optimización de procesos y toma de decisiones.
          </p>
        </div>
      </div>

      <div
        data-reveal
        className="relative left-1/2 mt-12 flex w-screen -translate-x-1/2 flex-col gap-8 px-4 sm:gap-10 sm:px-6 md:px-8 lg:px-12"
      >
        {withImages.map((item) => (
          <ExperienceImage
            key={item.title}
            src={item.image!}
            alt={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>

      {withoutImages.length > 0 && (
        <div className="section-container mt-12 space-y-6">
          {withoutImages.map((item) => (
            <div key={item.title} data-reveal className="glass-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold sm:text-2xl">{item.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
