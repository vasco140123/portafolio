# Portafolio — Vasco Qori Ramos Mercado

Portafolio personal con **Next.js 15**, **Tailwind CSS 4**, **GSAP**, **Typed.js**, **Framer Motion** y **vanilla-tilt**.

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Efectos implementados

| Feature       | Descripción                                             |
| ------------- | -------------------------------------------------------- |
| Loader        | Pantalla de carga ~2.6s al entrar                        |
| Progress bar  | Barra superior según scroll                             |
| Cursor        | Cursor personalizado (desktop)                           |
| Hero          | Texto tipado + entrada stagger (GSAP)                    |
| About         | Sección doble columna (estilo About1/2)                 |
| Projects      | Scroll horizontal con**pin** en desktop (≥1024px) |
| ProjectTile   | Efecto 3D tilt al hover                                  |
| Work          | Sticky scroll con Framer Motion (ONPE, tesis, UNCP)      |
| Collaboration | CTA “¿Colaboramos?”                                   |
| Meteors       | Animación en footer                                     |
| Contact       | WhatsApp activo + hover GSAP                             |
| Scroll reveal | GSAP ScrollTrigger en secciones                          |

## Estructura

```
app/              layout, page, clases, globals.css
components/       Hero, About, Skills, Projects, Work, etc.
lib/data.ts       Todos los textos y datos
hooks/            useScrollReveal, useStaggerMount, useIsDesktop
utils/cn.ts       clsx + tailwind-merge
```

## Personalización

1. **Foto:** `public/images/profile.jpg` → `profile.profileImage` en `lib/data.ts`
2. **Proyectos:** imágenes en `public/projects/` y datos en `projects[]`
3. **Frases tipadas:** `typedStrings` en `lib/data.ts`
4. **Experiencia:** `workExperience` en `lib/data.ts`

## Build

```bash
npm run build
npm start
```
