# Semana 8: Examen Parcial y Consolidación de Calificaciones

**Estudiante:** Vasco Qori Ramos Mercado
**Curso:** Desarrollo de Aplicaciones Web
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)
**Carrera:** Ingeniería de Sistemas
**Período:** 25 de mayo – 29 de mayo de 2026
**Herramientas:** PHP MVC, Conectividad PDO, Evaluación Backend

---

## 1. Formato y Estructura de la Evaluación Práctica

Durante la octava semana se llevó a cabo el **examen parcial correspondiente a la primera mitad del periodo lectivo**. El propósito fundamental de este examen radicó en verificar que el alumno tuviera la habilidad de estructurar un sistema web completamente funcional de forma independiente, aplicando las herramientas trabajadas a lo largo de las primeras siete semanas.

### Descripción del Proyecto Evaluativo

Las especificaciones de la prueba demandaron la creación de un **Sistema para la Gestión de Inventarios** provisto de las siguientes características indispensables:

- Enlace seguro con el motor MySQL mediante la extensión **PDO**.
- Arquitectura basada en el patrón **MVC** incorporando Enrutador y Front Controller.
- Implementación de funcionalidades **CRUD** completas (Alta, Lectura, Edición y Baja) en al menos dos tablas vinculadas.
- **Validación de datos de entrada** procesada strictly en el lado del servidor.
- Mecanismo de mitigación contra **Inyección SQL** apoyado en Prepared Statements.
- Control contra **vulnerabilidades XSS** mediante el escape sistemático de la salida HTML.
- Diagramado de interfaz **adaptable (responsive)** construido con HTML5 y CSS3.
- Administración básica del **estado de sesión** (inicio y cierre de sesión).

### Organización del Proyecto de Evaluación

```
sistema-inventario/
├── app/
│   ├── Controllers/
│   │   ├── AuthController.php        # Gestión de login/logout
│   │   ├── ProductoController.php    # CRUD de productos
│   │   └── CategoriaController.php   # CRUD de categorías
│   │
│   ├── Models/
│   │   ├── Producto.php              # Modelo con PDO para productos
│   │   ├── Categoria.php             # Modelo con PDO para categorías
│   │   └── Usuario.php               # Modelo para autenticación
│   │
│   └── Views/
│       ├── layouts/
│       │   └── main.php              # Layout principal
│       ├── auth/
│       │   └── login.php             # Formulario de autenticación
│       ├── productos/
│       │   ├── index.php             # Lista de productos
│       │   ├── crear.php             # Formulario de creación
│       │   ├── editar.php            # Formulario de edición
│       │   └── detalle.php           # Vista de detalle
│       └── categorias/
│           ├── index.php             # Lista de categorías
│           └── formulario.php        # Form crear/editar
│
├── config/
│   └── database.php                  # Configuración de conexión PDO
│
├── public/
│   ├── index.php                     # Front Controller
│   ├── .htaccess                     # mod_rewrite
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── scripts.js
│
├── core/
│   ├── Router.php                    # Sistema de enrutamiento
│   ├── Controller.php                # Clase base de controladores
│   └── Model.php                     # Clase base de modelos
│
├── database/
│   └── inventario.sql                # Script de creación de la BD
│
└── composer.json                     # Autoloading PSR-4
```

---

## 2. Criterios de Evaluación

La ponderación del examen se estableció sobre un total de **20 puntos**, desglosados en los siguientes rubros de calificación:

### Aspectos Técnicos (14 puntos)

| Criterio | Ponderación | Descripción |
|---|---|---|
| **Conexión mediante PDO** | 3 pts | Enlace correcto, captura de excepciones PDOException, ajuste de parámetros |
| **Arquitectura MVC** | 3 pts | Nítida división entre Modelo, Vista y Controlador; empleo de Front Controller |
| **Flujo CRUD completo** | 4 pts | Desarrollo operativo de operaciones de alta, lectura, edición y borrado con formularios válidos |
| **Protección ante SQL Injection** | 2 pts | Empleo obligatorio de Sentencias Preparadas en la totalidad de las consultas |
| **Prevención de XSS** | 2 pts | Aplicación de `htmlspecialchars()` o funciones análogas en cada renderizado de datos |

### Aspectos de Arquitectura (4 puntos)

| Criterio | Ponderación | Descripción |
|---|---|---|
| **Programación Orientada a Objetos** | 2 pts | Dominio de clases, encapsulamiento y relaciones de herencia según corresponda |
| **Estructura Modular** | 2 pts | Carga automática con Composer, distribución coherente de archivos y reutilización |

### Aspectos de Presentación (2 puntos)

| Criterio | Ponderación | Descripción |
|---|---|---|
| **Experiencia de Usuario** | 1 pt | Diseño intuitivo, adaptable y amigable para la navegación |
| **Documentación del Proyecto** | 1 pt | Inserción de comentarios en código y archivo README explicativo con pasos de instalación |

### Consideraciones sobre la Seguridad contra XSS

El riesgo de **Cross-Site Scripting (XSS)** surge cuando la aplicación muestra datos provistos por el usuario en el navegador sin aplicar una sanitización adecuada:

```php
<?php
// ️ CÓDIGO VULNERABLE A XSS
echo "<p>Bienvenido, " . $_GET['nombre'] . "</p>";
// Si nombre = <script>alert('Hackeado')</script>, se ejecuta en el navegador

//  CÓDIGO SEGURO - htmlspecialchars() convierte caracteres especiales en entidades HTML
echo "<p>Bienvenido, " . htmlspecialchars($_GET['nombre'], ENT_QUOTES, 'UTF-8') . "</p>";
// <script> se convierte en &lt;script&gt; — inofensivo para el navegador
```

---

## 3. Consolidación y Etapas Posteriores

### Comentarios y Retroalimentación Docente

La prueba parcial no solo constituyó un instrumento de medición cuantitativa, sino una valiosa oportunidad de retroalimentación técnica. Entre las observaciones principales emitidas por el docente destacaron:

**Fortalezas demostradas:**
- Adecuado uso de PDO haciendo uso constante de sentencias preparadas en el 100% de las operaciones de base de datos.
- Arquitectura MVC sólidamente organizada, respetando el principio de separación de responsabilidades.
- Correcta implementación del patrón Front Controller asociado a un sistema de ruteo eficiente.

**Puntos de mejora recomendados:**
- Robustecer los controles de validación en la capa del servidor (resulta indispensable validar los datos en el backend independientemente de las reglas en el frontend).
- Optimizar el tratamiento de excepciones entregando respuestas HTTP más precisas.
- Reforzar el filtrado y limpieza de datos en todos los puntos de entrada.

### Proyección hacia la Segunda Etapa del Semestre

El examen parcial marcó el cierre de la primera fase de aprendizaje. La segunda mitad del periodo académico comprenderá los siguientes módulos:

| Contenido | Semana |
|---|---|
| Arquitectura web y renderizado en el servidor (SSR) | Semana 9 |
| Fundamentos del lenguaje Python aplicado al desarrollo web | Semana 10 |
| Framework Django: Paradigma MTV, modelos y capas de vista | Semana 11 |
| Manejo de formularios, autenticación y middleware en Django | Semana 12 |
| Construcción de APIs RESTful con Django REST Framework | Semana 13 |
| Despliegue con microservicios, Docker y contenedores Kubernetes | Semana 14 |
| Presentación final y proyectos de Responsabilidad Social Universitaria | Semana 15 |

Este segundo tramo amplía las capacidades técnicas del estudiante al integrar Python y su ecosistema de aplicaciones (Django, DRF) junto con herramientas avanzadas de infraestructura (Docker, Kubernetes), competencias altamente demandadas en el ámbito profesional actual.

---

## 4. ¿Qué se aprendió?

La instancia de evaluación parcial operó como un intenso proceso de aprendizaje aplicado:

- **Consolidación de saberes:** Diseñar una solución completa de forma independiente requirió enlazar los temas estudiados individualmente en las semanas anteriores: preparación del entorno, estructuras de datos, POO, la API PDO, la arquitectura MVC y la seguridad web.

- **Organización del tiempo en escenarios de alta exigencia:** Desarrollar un producto totalmente operativo bajo restricciones de tiempo obligó a discriminar funcionalidades esenciales, resolver decisiones de arquitectura ágilmente y priorizar el valor central del sistema.

- **Diagnóstico y solución de errores en tiempo real:** Se identificaron y subsanaron fallos en la etapa de ejecución, consolidando la capacidad para analizar mensajes de error en PHP, el servidor Apache y la base de datos MySQL.

- **La seguridad como componente transversal:** Se ratificó que la seguridad informática no constituye un añadido posterior, sino un requisito primordial desde la concepción del proyecto. El uso de Sentencias Preparadas y la codificación de salidas HTML resultan tan vitales como la propia funcionalidad del software.

---

## 5. ¿Cómo se aplicó?

El desarrollo de la semana de evaluación se orientó enteramente a la práctica:

1. **Interpretación de requerimientos:** Se examinó detalladamente la guía de la prueba, especificando los requerimientos tanto funcionales como no funcionales y proyectando la arquitectura previa al desarrollo.

2. **Modelado de la base de datos:** Se creó el esquema relacional en PHPMyAdmin, generando las tablas `categorias`, `productos`, `usuarios` y `movimientos_stock` con sus correspondientes claves foráneas y restricciones.

3. **Desarrollo por capas de software:** Se avanzó siguiendo la secuencia del patrón MVC: iniciando por los Modelos (gestión de persistencia), continuando con los Controladores (lógica de flujo) y culminando en las Vistas (capa visual).

4. **Verificación de casos de uso:** Se comprobó el sistema simulación de interacción de usuario: inicio de sesión, consulta del catálogo, registro, modificación y borrado de elementos, validando el correcto funcionamiento de cada acción.

5. **Auditoría de seguridad:** Se llevó a cabo una verificación final cerciorándose de que cada consulta a la base de datos empleara Sentencias Preparadas y que el pintado de datos en pantalla estuviera protegido mediante `htmlspecialchars()`.
