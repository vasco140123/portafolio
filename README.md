# Portafolio Academico - Vasco Qori Ramos Mercado

Estudiante de Ingenieria de Sistemas | Universidad Nacional del Centro del Peru (UNCP) | 9no Ciclo

---

## Descripcion

Portafolio personal academico desarrollado para el curso Desarrollo de Aplicaciones Web (2025-I).
Documenta 15 semanas de aprendizaje, proyectos destacados, habilidades tecnicas y un sistema de bitacora interactivo.

---

## Arquitectura

Arquitectura Vanilla Web (sin frameworks ni bundlers) con un enfoque Mobile-First y Totalmente Fluido:

PORTAFOLIO COMPLETO/
├── index.html              (Pagina principal SPA)
├── leccion.html            (Lector de apuntes Markdown)
├── components/             (Componentes HTML parciales)
│   ├── navbar.html
│   ├── hero.html
│   ├── admin-panel.html    (Panel de gestion CMS)
│   └── ...
└── public/
    ├── css/                (Hojas de estilo por seccion y globales)
    ├── js/                 (Logica JavaScript nativa)
    │   ├── includeComponents.js  (Cargador de componentes)
    │   ├── animations.js         (GSAP, Typed.js, Vanilla-Tilt)
    │   ├── lessonManager.js      (Renderizado de Markdown)
    │   └── cmsManager.js         (Panel CMS, GitHub API y guardado JSON)
    ├── md/                 (Apuntes en Markdown - 15 semanas)
    └── data.json           (Base de datos local del portafolio)

---

## Caracteristicas

* Diseno Dark Premium: Paleta oscura con acentos violeta y cyan, inspirado en Bento Box.
* Component Loader: Archivos HTML parciales cargados via fetch().
* Markdown Rendering: Apuntes y bitacoras renderizados de forma dinamica con Marked.js.
* CMS Local: Panel de administracion (Dashboard) para agregar proyectos desde GitHub, crear certificados y semanas de clases, exportando la data en JSON.
* Interaccion Dinamica: Animaciones con GSAP, Reveal y Typed.js optimizadas con prefers-reduced-motion.
* Mobile-First UX: Navegacion inferior (Thumb Zone), tipografia fluida con CSS Clamp y grid automaticos (auto-fit).

---

## Stack Tecnologico

- HTML5 - Estructura semantica
- CSS3 - Variables CSS, Grid, Flexbox, Container Queries, 100dvh
- JavaScript ES6+ - Modulos nativos, Fetch API, LocalStorage
- Marked.js - Renderizado de Markdown
- Highlight.js - Resaltado de sintaxis en codigo
- GSAP 3 + ScrollTrigger - Animaciones avanzadas
- Typed.js - Efecto de escritura en terminal
- Vanilla-Tilt - Efecto 3D interactivo en tarjetas

---

## Como ejecutar localmente

No requiere Node.js ni instalacion. Solo necesitas un servidor local para el fetch() de componentes y Markdown.

Opcion 1: Live Server (VS Code)
1. Instala la extension Live Server
2. Clic derecho en index.html -> Open with Live Server
3. Abre http://localhost:5500

Opcion 2: Python
python -m http.server 3000

Opcion 3: Node.js
npx serve .

---

## Autor

Vasco Qori Ramos Mercado
- GitHub: @vasco140123
- Correo: 2021200796I@uncp.edu.pe
- WhatsApp: +51 923 391 427

---

## Licencia

Proyecto academico - Todos los derechos reservados.
