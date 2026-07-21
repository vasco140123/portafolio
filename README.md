# 🚀 Portafolio Académico — Vasco Qori Ramos Mercado

> Estudiante de Ingeniería de Sistemas · Universidad Nacional del Centro del Perú (UNCP) · 5to Ciclo

---

## 🧩 Descripción

Portafolio personal académico desarrollado para el curso **Desarrollo de Aplicaciones Web** (2025-I).
Documenta 15 semanas de aprendizaje, proyectos destacados, habilidades técnicas y un sistema de bitácora interactivo.

---

## 🏗️ Arquitectura

Arquitectura **Vanilla Web** (sin frameworks ni bundlers):

```
PORTAFOLIO COMPLETO/
├── index.html              ← Página principal (SPA)
├── leccion.html            ← Lector de apuntes Markdown
├── components/             ← Componentes HTML parciales
│   ├── navbar.html
│   ├── hero.html
│   ├── about.html
│   ├── skills.html
│   ├── projects.html
│   ├── sesiones-clase.html
│   ├── certifications.html
│   ├── contact.html
│   └── footer.html
└── public/
    ├── css/                ← Hojas de estilo por sección
    │   ├── styles.css      ← Variables, reset y utilidades globales
    │   ├── navbar.css
    │   ├── hero.css
    │   ├── about.css
    │   ├── skills.css
    │   ├── projects.css
    │   ├── sesiones.css
    │   ├── leccion.css
    │   └── contact.css
    ├── js/                 ← Lógica JavaScript nativa
    │   ├── includeComponents.js  ← Cargador de componentes
    │   ├── animations.js         ← GSAP, Typed.js, Vanilla-Tilt
    │   ├── lessonManager.js      ← Renderizado de Markdown
    │   └── crudManager.js        ← CRUD de sesiones en localStorage
    ├── md/                 ← Apuntes en Markdown (15 semanas)
    │   ├── semana1.md ... semana15.md
    ├── img/                ← Imágenes de perfil y experiencia
    └── projects/           ← Capturas de proyectos
```

---

## ✨ Características

| Característica | Descripción |
|---|---|
| 🎨 **Diseño Dark Mode** | Paleta oscura con acentos violeta y cyan |
| 🔄 **Component Loader** | HTML parciales cargados vía `fetch()` |
| 📚 **Markdown Rendering** | Apuntes renderizados con `Marked.js` |
| ✏️ **CRUD de Sesiones** | Crear, editar y eliminar sesiones en `localStorage` |
| 🎯 **GSAP Animations** | Scroll reveal, cursor personalizado, typed text |
| 📱 **Responsive** | Funciona en móvil, tablet y desktop |
| ♿ **Accesibilidad** | ARIA labels, roles semánticos, focus visible |

---

## 🛠️ Stack Tecnológico

- **HTML5** — Estructura semántica
- **CSS3** — Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+** — Módulos nativos, Fetch API, LocalStorage
- **[Marked.js](https://marked.js.org/)** — Renderizado de Markdown
- **[GSAP 3](https://gsap.com/)** + ScrollTrigger — Animaciones avanzadas
- **[Typed.js](https://mattboldt.com/demos/typed-js/)** — Efecto de escritura
- **[Vanilla-Tilt](https://micku7zu.github.io/vanilla-tilt.js/)** — Efecto 3D en tarjetas
- **[Highlight.js](https://highlightjs.org/)** — Resaltado de código en apuntes

---

## 🚀 Cómo ejecutar localmente

> **No requiere Node.js ni instalación**. Solo necesitas un servidor local para el `fetch()` de componentes y Markdown.

### Opción 1: Live Server (VS Code)

1. Instala la extensión **Live Server**
2. Clic derecho en `index.html` → **Open with Live Server**
3. Abre `http://localhost:5500`

### Opción 2: Python

```bash
python -m http.server 3000
# Abre http://localhost:3000
```

### Opción 3: Node.js (npx serve)

```bash
npx serve .
```

---

## 👤 Autor

**Vasco Qori Ramos Mercado**
- GitHub: [@vasco140123](https://github.com/vasco140123)
- Correo: [2021200796I@uncp.edu.pe](mailto:2021200796I@uncp.edu.pe)
- WhatsApp: [+51 923 391 427](https://wa.me/51923391427)

---

## 📄 Licencia

Proyecto académico — Todos los derechos reservados.
