import ClasesTimeline from "@/components/clases/ClasesTimeline";

export const metadata = {
  title: "Ruta de Aprendizaje | Vasco Qori Ramos Mercado",
  description: "Cronograma detallado de contenidos, objetivos pedagógicos y herramientas de desarrollo.",
};

export default function ClasesPage() {
  return (
    <div className="min-h-screen pb-24 pt-28">
      <div className="section-container">
        <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
          Ruta de Aprendizaje
        </p>
        <h1 className="section-title mt-2">Sesiones de Clase</h1>
        <p className="section-subtitle">
          Cronograma detallado de contenidos, objetivos pedagógicos y herramientas de desarrollo implementadas a lo largo de las primeras 8 semanas académicas.
        </p>
      </div>
      <ClasesTimeline />
    </div>
  );
}
