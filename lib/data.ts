export const profile = {
  fullName: "Vasco Qori Ramos Mercado",
  shortName: "Vasco",
  role: "Estudiante del IX semestre de Ingeniería de Sistemas en la UNCP",
  email: "2021200796I@uncp.edu.pe",
  phone: "923391427",
  github: "https://github.com/vasco140123",
  aboutParagraphs: [
    "Soy estudiante y desarrollador orientado al área de Tecnologías de la Información, con experiencia en desarrollo de sistemas web, bases de datos y análisis de procesos. He trabajado en proyectos utilizando Java, SQL Server y tecnologías web, enfocándome en crear soluciones funcionales, organizadas y escalables.",
    "Me interesa especialmente el desarrollo de software, la automatización de procesos y el análisis de datos aplicado a entornos empresariales y educativos. Además, cuento con experiencia en la estructuración y presentación de proyectos tecnológicos, integrando conceptos de arquitectura de software, dashboards y transformación digital.",
    "Actualmente continúo fortaleciendo mis conocimientos en desarrollo web, inteligencia de datos y tecnologías emergentes, buscando construir soluciones innovadoras con impacto real.",
  ],
  profileImage: "/portafolio/img/perfil.jpeg",
} as const;

export const typedStrings = [
  "Desarrollador full stack",
  "Analista de datos & BI",
  "Arquitectura de software",
  "Ingeniería de Sistemas — UNCP",
] as const;

export const navLinks = [
  { label: "Inicio", href: "/#hero" },
  { label: "Sobre mí", href: "/#about" },
  { label: "Habilidades", href: "/#skills" },
  { label: "Proyectos", href: "/#projects" },
  { label: "Experiencia", href: "/#work" },
  { label: "Certificaciones", href: "/#certifications" },
  { label: "Contacto", href: "/#contact" },
  { label: "Clases", href: "/clases" },
] as const;

export const socialLinks = [
  { name: "GitHub", href: "https://github.com/vasco140123", icon: "github" as const },
  { name: "Correo", href: "mailto:2021200796I@uncp.edu.pe", icon: "mail" as const },
] as const;

/** slug = nombre en https://simpleicons.org (para logos en cdn.simpleicons.org) */
export const skills = [
  { name: "Java", slug: "java" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Python", slug: "python" },
  { name: "SQL Server", slug: "microsoftsqlserver" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Power BI", slug: "powerbi" },
  { name: "Git", slug: "git" },
  { name: "Docker", slug: "docker" },
  { name: "GSAP", slug: "greensock" },
  { name: "Apache Airflow", slug: "apacheairflow" },
  { name: "Kali Linux", slug: "kalilinux" },
] as const;

export const projects = [
  {
    id: 1,
    title: "Unificación de Datos Presupuestales (UNCP)",
    description: "Sistema para la automatización del procesamiento de datos presupuestales en la Universidad Nacional del Centro del Perú (UNCP). Realiza el cruce inteligente (outer join) de reportes de certificaciones (MPP18) y ejecución (ADM16) mediante clave de año y certificado, con cálculo automático de saldos y exportación optimizada.",
    tags: ["Python", "Pandas", "PySide6 / Qt", "Tkinter", "Excel Integration"],
    gradient: "from-violet-600/40 via-fuchsia-500/20 to-transparent",
    github: "https://github.com/vasco140123/UNIFICACION-DE-DATOS-PRESUPUESTALES.git",
    image: "/portafolio/projects/budget.png",
  },
  {
    id: 2,
    title: "DecorFinanzas Pro",
    description: "Aplicación de finanzas y facturación inteligente para negocios. Cuenta con un generador de facturas y notas de venta, registro histórico de transacciones, visualización de métricas y un escáner inteligente impulsado por Gemini AI (@google/genai) para leer automáticamente los recibos.",
    tags: ["React", "Vite", "Gemini AI", "Recharts", "Lucide Icons"],
    gradient: "from-cyan-500/40 via-blue-600/20 to-transparent",
    github: "https://github.com/vasco140123/decorfinanzas.git",
    image: "/portafolio/projects/decor.png",
  },
  {
    id: 3,
    title: "Geek Dashboard",
    description: "Dashboard interactivo con un diseño moderno de alta fidelidad para el análisis de métricas en tiempo real. Utiliza componentes optimizados con React y Vite para la visualización de KPI y gestión de estados interactivos.",
    tags: ["React", "Vite", "Dashboard", "CSS Grid", "Tailwind CSS"],
    gradient: "from-emerald-500/40 via-teal-600/20 to-transparent",
    github: "https://github.com/vasco140123/geek-dashboard.git",
    image: "/portafolio/projects/geek.png",
  },
  {
    id: 4,
    title: "Manipulación del DOM y Funciones Avanzadas",
    description: "Proyecto práctico enfocado en el desarrollo de interfaces dinámicas e interactivas utilizando JavaScript y TypeScript nativos. Implementa control avanzado de eventos, promesas, llamadas asíncronas y validación estructurada de formularios.",
    tags: ["JavaScript", "TypeScript", "DOM API", "Asynchronous", "Validaciones"],
    gradient: "from-amber-500/40 via-orange-600/20 to-transparent",
    github: "https://github.com/vasco140123/JavaScript-TypeScript-Manipulaci-n-del-DOM-Funciones-Avanzadas.git",
    image: "/portafolio/projects/dom.png",
  },
  {
    id: 5,
    title: "Gestión de Tareas (React Hooks Avanzados)",
    description: "Aplicación grupal robusta de gestión de tareas que demuestra el uso práctico y justificado de hooks de React como useReducer, useContext, useMemo y useCallback. Incluye persistencia sincrónica con localStorage, debounce personalizado y gráficos estadísticos de rendimiento.",
    tags: ["React", "Vite", "useReducer", "Theme Context", "Performance Optimization"],
    gradient: "from-pink-500/40 via-red-600/20 to-transparent",
    github: "https://github.com/vasco140123/React-Hooks-semana-7-GRUPAL.git",
    image: "/portafolio/projects/task.png",
  },
  {
    id: 6,
    title: "Aplicación Web Integrada (Semana 6)",
    description: "Aplicación web que conecta y consume servicios de API externas de manera eficiente utilizando la librería Axios. Demuestra control de ciclos de vida de componentes en React 19 y manejo dinámico de estados locales.",
    tags: ["React 19", "Vite", "Axios", "API Integration", "State Management"],
    gradient: "from-indigo-500/40 via-purple-600/20 to-transparent",
    github: "https://github.com/vasco140123/semana-6-aplicacion-web.git",
    image: "/portafolio/projects/web.png",
  },
] as const;

export const workExperience = [
  {
    title: "Experiencia en desarrollo de sistemas",
    description:
      "Proyectos con Java, SQL Server y tecnologías web, orientados a soluciones funcionales, organizadas y escalables para entornos empresariales y educativos.",
    image: "/portafolio/img/exp.jpg",
    gradient: "linear-gradient(to bottom right, #8b5cf6, #22d3ee)",
  },
  {
    title: "Proyectos tecnológicos y análisis de datos",
    description:
      "Estructuración y presentación de iniciativas integrando arquitectura de software, dashboards, automatización de procesos y transformación digital.",
    image: "/portafolio/img/exp2.jpeg",
    gradient: "linear-gradient(to bottom right, #22d3ee, #6366f1)",
  },
  {
    title: "Formación — Ingeniería de Sistemas UNCP",
    description:
      "IX semestre. Desarrollo web, inteligencia de datos y tecnologías emergentes, con enfoque en innovación y impacto real.",
    gradient: "linear-gradient(to bottom right, #6366f1, #a855f7)",
  },
] as const;

export const certifications = [
  {
    id: 1,
    title: "Certificación placeholder I",
    issuer: "Organismo / Plataforma",
    year: "2025",
  },
  {
    id: 2,
    title: "Certificación placeholder II",
    issuer: "Organismo / Plataforma",
    year: "2024",
  },
  {
    id: 3,
    title: "Certificación placeholder III",
    issuer: "Organismo / Plataforma",
    year: "2024",
  },
] as const;

export const collaboration = {
  title: "¿Colaboramos?",
  description:
    "Abierto a oportunidades de prácticas, proyectos de datos y desarrollo web. Escríbeme y conversemos.",
  cta: "Hablemos",
  href: "/#contact",
} as const;

export const contact = {
  whatsappLabel: "Contáctame por WhatsApp",
  whatsappHref: "https://wa.me/51923391427",
} as const;

export const clasesWeeks = [
  {
    week: 1,
    title: "Introducción al Entorno de Desarrollo y Configuración del Servidor Local",
    date: "06 de abril - 10 de abril",
    content:
      "Instalación de herramientas base, configuración de variables de entorno, ciclo de vida de una petición HTTP del lado del servidor y despliegue del primer script en entorno local.",
    tags: ["VS Code", "XAMPP", "PHP 8.x"],
  },
  {
    week: 2,
    title: "Estructuras de Control, Tipos de Datos Avanzados y Funciones Nativas",
    date: "13 de abril - 17 de abril",
    content:
      "Implementación de flujos condicionales lógicos, bucles iterativos optimizados, manipulación avanzada de arreglos estructurados y modularización mediante funciones reutilizables.",
    tags: ["Algoritmia Backend", "PHP Vanilla"],
  },
  {
    week: 3,
    title: "Programación Orientada a Objetos (POO) del Lado del Servidor",
    date: "20 de abril - 24 de abril",
    content:
      "Modelado de clases, instanciación de objetos, aplicación práctica de encapsulamiento, herencia y polimorfismo para construir lógica de negocio escalable.",
    tags: ["POO Paradigma", "Clases abstractas"],
  },
  {
    week: 4,
    title: "Persistencia de Datos: Conectividad y Consultas Relacionales SQL",
    date: "27 de abril - 01 de mayo",
    content:
      "Modelado físico de bases de datos relacionales, establecimiento de conexiones seguras mediante PDO (PHP Data Objects), sanitización de consultas y prevención de ataques SQL Injection.",
    tags: ["MySQL", "PDO Client", "PHPMyAdmin"],
  },
  {
    week: 5,
    title: "Patrón Arquitectónico de Diseño MVC (Modelo-Vista-Controlador)",
    date: "04 de mayo - 08 de mayo",
    content:
      "Separación estricta de responsabilidades web: desacoplamiento de la interfaz de usuario de la persistencia de datos mediante el enrutamiento de peticiones a controladores lógicos centrales.",
    tags: ["MVC Pattern", "Software Architecture"],
  },
  {
    week: 6,
    title: "Manejo de Dependencias Backend con Composer y APIs RESTful Básicas",
    date: "11 de mayo - 15 de mayo",
    content:
      "Gestión e instalación de librerías externas del ecosistema Packagist, estructuración de peticiones HTTP semánticas (GET, POST) y serialización de respuestas nativas en formato JSON.",
    tags: ["Composer Package", "JSON API", "Postman"],
  },
  {
    week: 7,
    title: "Fundamentos, Ruteo e Introducción Práctica al Framework Laravel",
    date: "18 de mayo - 22 de mayo",
    content:
      "Estructura de directorios global, configuración del motor de plantillas Blade, sistema de ruteo web semántico e implementación del mapeador relacional Eloquent ORM.",
    tags: ["Laravel Framework", "Blade Engine", "Eloquent ORM"],
  },
  {
    week: 8,
    title: "Evaluación Parcial y Consolidado de Notas",
    date: "25 de mayo - 29 de mayo",
    content:
      "Evaluación práctica individual sobre desarrollo backend con PHP, MVC, conectividad PDO con bases de datos MySQL y estructuración de proyectos escalables.",
    tags: ["Evaluación Backend", "PHP MVC", "PDO Conectividad"],
  },
] as const;
