# Semana 15: Presentación del Proyecto de Investigación y Responsabilidad Social Universitaria (RSU)

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 14 de julio – 18 de julio de 2026  
**Actividad:** Presentación de Proyecto de Investigación y Responsabilidad Social Universitaria  

---

## 1. Encuadre y Contexto de la Sesión

La décimo quinta semana constituyó el **cierre oficial del periodo académico 2026-I** en la materia de Desarrollo de Aplicaciones Web. Distinto de las jornadas previas orientadas a la adquisición continua de capacidades técnicas, este periodo se destinó de forma exclusiva a la **divulgación, sintetización y retribución social** de las competencias acumuladas.

### Aspectos Clave de la Semana de Presentaciones

Durante esta etapa no se añadieron conceptos teóricos novedosos ni herramientas adicionales. El propósito central se desglosó en tres vertientes:

1. **Sustentar** el trabajo de investigación elaborado a lo largo del ciclo frente a la clase y el docente.
2. **Transmitir** con solvencia técnica y exactitud los hallazgos conseguidos, los criterios arquitectónicos aplicados y los aprendizajes derivados.
3. **Analizar** de manera comunitaria la trayectoria formativa experimentada a lo largo de las 15 semanas de la asignatura.

### Relevancia de la Transmisión de Conocimientos Técnicos

Un aspecto frecuentemente relegado dentro del perfil del ingeniero de sistemas es la **habilidad para exponer de forma clara ideas técnicas** ante interlocutores con variados niveles de especialización. Dicha capacidad fue puesta a prueba durante esta sesión:

- Exponer ante compañeros de la misma disciplina exige **rigor analítico y profundidad de contenido**.
- Explicar ante el docente examinador precisa de la **fundamentación sólida de las elecciones de diseño**.
- Dirigirse a un público no especializado (como en la ejecución de la RSU) demanda **sencillez y el empleo de ejemplos intuitivos**.

Desarrollar la flexibilidad para transitar sin dificultad entre estos tres enfoques comunicativos constituye una cualidad distributiva entre un profesional promedio y un ingeniero destacado.

---

## 2. Desarrollo del Proyecto de Investigación

### Resumen del Proyecto

La investigación expuesta llevó por título **"Sistema Web de Gestión de Inventario para Microempresas Comerciales de Huancayo: Implementación con Django REST Framework y React"**.

La iniciativa se fundamentó en un diagnóstico territorial directo: gran parte de las pequeñas unidades comerciales del Mercado Mayorista de Huancayo administran su stock en cuadernos en papel o mediante hojas de cálculo de Excel distribuidas por WhatsApp. Esta práctica provoca:

- **Imprecisiones constantes** causadas por desfasajes de información entre vendedores.
- **Fugas financieras** vinculadas a la ausencia de control en tiempo real sobre las existencias.
- **Imposibilidad de realizar análisis** de tendencias pasadas para guiar el abastecimiento comercial.

### Marco Metodológico Adoptado

La investigación aplicó un enfoque de **Investigación-Acción Participativa (IAP)** complementado con el **marco ágil de desarrollo Scrum**:

| Fase | Actividad | Resultado |
|---|---|---|
| **Diagnóstico** | Entrevistas con 8 microempresarios del Mercado Mayorista | Relevamiento de requerimientos funcionales |
| **Diseño** | Arquitectura API REST + React, modelo de datos | Especificación técnica del sistema |
| **Desarrollo Sprint 1** | Backend Django API: modelos, serializers, endpoints CRUD | API operativa compuesta por 12 endpoints |
| **Desarrollo Sprint 2** | Frontend React: vistas de inventario, búsqueda, reportes | Interfaz gráfica adaptable y responsiva |
| **Pruebas** | Evaluaciones de uso con los microempresarios | Optimización de UX y ajustes en la lógica de negocio |
| **Entrega** | Capacitación e implementación del sistema | Despliegue y uso en 3 microempresas piloto |

### Arquitectura Tecnológica Empleada

```
Backend:
├── Python 3.12
├── Django 4.2
├── Django REST Framework 3.15
├── PostgreSQL 16 (base de datos)
├── Redis (cache de consultas frecuentes)
└── Docker + docker-compose (entorno reproducible)

Frontend:
├── React 18 con Vite
├── React Query (gestión de estado del servidor)
├── Axios (cliente HTTP)
└── Tailwind CSS (estilos)

Infraestructura:
└── VPS Ubuntu 22.04 + Nginx + Certbot (SSL gratuito)
```

### Indicadores y Resultados Alcanzados

Los datos cuantitativos recabados a lo largo de la fase piloto (30 días) en los tres negocios participantes demostraron:

- **Disminución del 78%** en el tiempo para verificar existencias (pasando de ~5 minutos mediante revisión manual a ~10 segundos con el software).
- **Erradicación total (100%)** de inconsistencias en el inventario reportado por los colaboradores de un mismo local.
- **Emisión automatizada** de informes semanales sobre artículos en punto crítico de reabastecimiento.
- **Aceptación de los usuarios:** la totalidad (100%) de los comerciantes manifestó su deseo de mantener el uso de la plataforma al culminar la prueba.

### Restricciones y Proyección Futura

- La herramienta demanda conectividad a internet, factor que representa un obstáculo en áreas del mercado con cobertura deficiente.
- La integración de modelos analíticos de predicción de demanda se ha contemplado para versiones posteriores.
- El enlace directo con plataformas de comprobantes electrónicos (SUNAT) conforma la siguiente etapa prioritaria.

---

## 3. Iniciativa de Responsabilidad Social Universitaria (RSU)

### Alcance y Definición de la RSU

La **Responsabilidad Social Universitaria (RSU)** encarna la obligación ética y social de las instituciones académicas con el progreso sostenible de la comunidad y el entorno. En la UNCP, este compromiso orienta a los estudiantes a volcar sus competencias técnicas hacia la atención de problemáticas sociales tangibles, priorizando a los sectores con menor acceso al ámbito tecnológico.

La RSU asume que la universidad pública peruana forma parte activa del tejido social que la financia, imponiendo el deber de devolver dicho respaldo mediante la generación de un impacto positivo directo en la ciudadanía.

### Intervención de RSU Desarrollada

La jornada de RSU del presente semestre se materializó a través del **Taller de Alfabetización Digital Básica**, efectuado en la comunidad de **Acopalca, provincia de Huancayo**, beneficiando a 25 adultos mayores de la zona.

**Meta del taller:** Capacitar a los asistentes en el manejo básico y seguro de dispositivos móviles (smartphones y tabletas), concentrándose en:
- Búsqueda de información en la web.
- Interacción con familiares a través de videollamadas (WhatsApp, Google Meet).
- Detección de alertas y mensajes engañosos (prevención de phishing y estafas telefónicas).
- Acceso a servicios digitales de salud (SIS Informa, aplicaciones del MINSA).

**Esquema Metodológico del Taller:**
- Sesiones de 2 horas dictadas a lo largo de 3 sábados seguidos.
- Estrategia vivencial: interacción directa de cada participante con su equipo.
- Guías impresas elaboradas en lenguaje accesible, exentas de modismos técnicos.
- Acompañamiento de 4 estudiantes de Ingeniería de Sistemas en el rol de capacitadores.

### Despliegue del Trabajo en Equipo

La ejecución del programa RSU demandó una labor de equipo articulada, distribuyendo las tareas de la siguiente manera:

| Rol | Responsabilidad |
|---|---|
| **Coordinación** | Gestión de permisos, logística, traslado de equipos |
| **Contenido** | Elaboración del material didáctico impreso y digital |
| **Facilitación técnica** | Asistencia directa a los participantes durante los talleres |
| **Documentación** | Cobertura fotográfica, control de asistencia y redacción del informe final |

La enseñanza central extraída de la dinámica grupal residió en reconocer que **la pericia técnica es un requisito necesario pero insuficiente** cuando se busca generar transformación social. La **empatía**, la **paciencia** y la destreza para **dialogar sin tecnicismos** se erigieron como los pilares más demandados en la intervención.

### Evaluación del Impacto y Reflexiones sobre la RSU

La vivencia en Acopalca tuvo un profundo calado personal. Observar la satisfacción de un adulto mayor al establecer por primera vez contacto por videollamada con sus familiares residentes en Lima impregna de un valor auténticamente humano los contenidos técnicos adquiridos en las aulas.

En nuestro proceso formativo como ingenieros de sistemas, debemos cuestionarnos permanentemente: **¿para beneficio de quién desarrollamos tecnología?** Las soluciones más complejas pierden sentido si no impactan a los sectores vulnerables o si terminan profundizando brechas en lugar de acortarlas.

---

## 4. Consideraciones Finales sobre el Semestre Académico

### Retrospectiva General del Recorrido de 15 Semanas

Al arribar a la conclusión del periodo 2026-I, resulta oportuno evaluar la evolución lograda desde los inicios del semestre. La distancia entre los primeros pasos con herramientas como XAMPP y el entendimiento actual de arquitecturas basadas en microservicios, Kubernetes y servicios RESTful refleja un avance significativo.

**Resulta llamativo** comprobar la naturaleza **gradual y acumulativa** del aprendizaje técnico. Cada etapa sirvió de cimiento para la siguiente:

```
Semana 1-2:  Entorno de desarrollo + Fundamentos PHP
    │
    ▼
Semana 3-4:  POO + Bases de datos relacionales
    │
    ▼
Semana 5-6:  Arquitectura MVC + APIs RESTful básicas
    │
    ▼
Semana 7-8:  Laravel Framework + Evaluación parcial
    │
    ▼
Semana 9:    Panorama de arquitecturas web
    │
    ▼
Semana 10-11: Python + Django Framework
    │
    ▼
Semana 12-13: Django Auth + Django REST Framework
    │
    ▼
Semana 14:   Docker + Microservicios + Kubernetes
    │
    ▼
Semana 15:   Investigación + RSU + Integración
```

### Logros y Competencias Consolidadas

En el transcurso del presente periodo académico, conseguí:

- **Aprehender dos ecosistemas backend integrales:** PHP/Laravel junto a Python/Django, abordando sus ORMs, motores de plantillas y herramientas de construcción.
- **Internalizar la seguridad como un principio constante:** Amenazas como XSS, inyección SQL, vulnerabilidades CSRF, tokens JWT y la administración de sesiones pasaron de ser tópicos teóricos a criterios permanentes al programar.
- **Evolucionar del código aislado a la visión sistémica:** Trascender la programación de scripts en PHP para asumir el diseño integral de plataformas estructuradas con MVC, APIs RESTful, esquemas de autenticación, migraciones y contenedores Docker.
- **Vincular la teoría con necesidades sociales:** Tanto la investigación como las acciones de RSU evidenciaron que lo aprendido en clase puede trasladarse directamente a soluciones de impacto en el medio.

### Objetivos de Desarrollo Futuro

La culminación del semestre marca el arranque de una fase de mayor especialización. Los objetivos que me he fijado comprenden:

1. **Perfeccionar habilidades en Django REST Framework y FastAPI:** Comprendiendo que los servicios API vertebran las soluciones modernas.
2. **Consolidar el aprendizaje de React:** Para la construcción de interfaces dinámicas conectadas a mis propios servicios.
3. **Avanzar hacia la certificación AWS Cloud Practitioner:** Entendiendo el despliegue en la nube como un estándar del sector.
4. **Participar en desarrollos open source:** Como vía para afianzar destrezas y colaborar activamente con la comunidad.
5. **Impulsar proyectos con impacto territorial:** Aplicando herramientas digitales para responder a los desafíos de Huancayo y la región Junín.

### Reflexión de Cierre

Formarse en Ingeniería de Sistemas en la UNCP dentro de Huancayo representa un compromiso particular: la región posee una amplia dinámica económica (agroindustria, minería, servicios) combinada con una brecha digital que los profesionales egresados de nuestras aulas estamos llamados a acortar.

Cada técnica asimilada durante estas 15 semanas constituye un recurso valioso. El desafío de los próximos años radica en orientar conscientemente dicho conocimiento, anteponiendo en todo momento el beneficio de las personas a la mera complejidad técnica.

---

*Portafolio académico del ciclo 2026-I — Desarrollo de Aplicaciones Web — UNCP*  
*Vasco Qori Ramos Mercado | Ingeniería de Sistemas*  
