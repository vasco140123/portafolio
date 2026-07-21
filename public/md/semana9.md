# Semana 9: Arquitectura de Aplicaciones Web y Desarrollo en el Servidor (Server Side)

**Estudiante:** Vasco Qori Ramos Mercado
**Curso:** Desarrollo de Aplicaciones Web
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)
**Carrera:** Ingeniería de Sistemas
**Período:** 02 de junio – 06 de junio de 2026
**Herramientas:** PHP, JSP, Apache HTTP Server, Apache Tomcat

---

## 1. Arquitectura de Aplicaciones Web

Una **aplicación web** consiste en una solución de software ejecutada en un entorno de servidor, a la cual los usuarios finales acceden mediante un navegador mediante el protocolo HTTP/HTTPS. A diferencia del software de escritorio tradicional, los sistemas web no demandan instalación local en el dispositivo del cliente: la totalidad del procesamiento y la lógica residen en el servidor.

### Arquitectura de Tres Capas (Three-Tier Architecture)

El modelo estructural más difundido en el desarrollo de software empresarial distribuye el sistema en **tres capas funcionales**, con cometidos nítidamente delimitados:

```
┌─────────────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN (Cliente)          │
│  Navegador Web: HTML, CSS, JavaScript             │
│  Dispositivo móvil, aplicación SPA               │
└───────────────────────┬─────────────────────────┘
                        │ HTTP/HTTPS (peticiones/respuestas)
┌───────────────────────▼─────────────────────────┐
│           CAPA DE LÓGICA (Servidor Web)           │
│  Apache / Nginx / Tomcat / Node.js               │
│  PHP / Python / Java / Ruby / Go                 │
│  Reglas de negocio, procesamiento, APIs          │
└───────────────────────┬─────────────────────────┘
                        │ SQL / ORM / Drivers
┌───────────────────────▼─────────────────────────┐
│              CAPA DE DATOS (Base de Datos)        │
│  MySQL / PostgreSQL / MongoDB / Redis            │
│  Almacenamiento persistente de información       │
└─────────────────────────────────────────────────┘
```

### Comunicación mediante Protocolos

La interacción entre capas se lleva a cabo mediante protocolos estandarizados de comunicación:

- **HTTP/HTTPS:** Enlace entre el cliente (navegador) y el servidor de aplicaciones. HTTP transmite texto plano; HTTPS incorpora una capa de cifrado mediante TLS/SSL.
- **TCP/IP:** Protocolo de red fundamental que asegura la transmisión confiable de los paquetes de datos.
- **SQL:** Lenguaje estructurado empleado por la capa de la aplicación para interactuar con los motores de bases de datos.
- **WebSockets:** Protocolo de comunicación dúplex y persistente enfocado en aplicaciones con actualización en tiempo real (canales de chat, notificaciones instantáneas).

---

## 2. Servidores Web

Un **servidor web** representa la pieza de software encargada de recibir las peticiones HTTP emitidas por los clientes y despachar las respuestas correspondientes. Se identifican dos roles principales en la función de un servidor:

### Servidores de Contenido Estático frente a Servidores de Aplicaciones

| Tipo | Función Principal | Ejemplo Representativo |
|---|---|---|
| **Servidor de archivos estáticos** | Distribuye recursos sin modificar su contenido (ficheros HTML, estilos CSS, imágenes) | Nginx operando como proxy |
| **Servidor de aplicaciones** | Ejecuta la lógica del backend y elabora respuestas dinámicas | Apache apoyado en mod_php, Tomcat |

### Apache HTTP Server

**Apache** (httpd) constituye una de las tecnologías de servidor web de código abierto más consolidadas del sector. Entre sus características esenciales sobresalen:

- **Arquitectura modular:** Permite expandir sus funcionalidades de forma flexible. La extensión `mod_php` faculta la ejecución nativa de scripts PHP dentro del proceso Apache.
- **Archivos `.htaccess`:** Posibilitan modificar configuraciones locales por directorio sin necesidad de reiniciar la instancia del servidor.
- **Hosts Virtuales:** Permite alojar y despachar múltiples sitios web autónomos dentro de un mismo servidor físico.
- **Módulo `mod_rewrite`:** Mecanismo para la reescritura dinámica de rutas web, facilitando la creación de URLs amigables.

### Nginx

**Nginx** (pronunciado "engine-x") es un servidor web y proxy inverso diseñado para ofrecer un desempeño de alto rendimiento. En contraste con Apache, emplea un esquema orientado a eventos asíncronos en lugar de hilos de ejecución por conexión, lo que le posibilita atender miles de solicitudes simultáneas con un consumo mínimo de memoria RAM. Por lo general, Nginx opera como **proxy inverso** situándose por delante de un servidor de aplicaciones:

```
Cliente → Nginx (proxy inverso) → Servidor de Aplicación (PHP-FPM, Gunicorn, etc.)
```

### IIS (Internet Information Services)

**IIS** es el servidor web nativo de **Microsoft**, empaquetado en la familia de sistemas Windows Server. Representa la opción predilecta para dar soporte a sistemas desarrollados sobre el entorno **ASP.NET (C#)** y se administra desde la consola de Windows. Ofrece compatibilidad nativa con HTTP/2, WebSockets y gestión de certificados SSL dentro del ecosistema Microsoft Azure.

---

## 3. Principios del Server Side Rendering (SSR)

El **Server Side Rendering (SSR)** o procesamiento en el servidor es el enfoque arquitectónico en el que el código HTML de una página se genera íntegramente en la máquina servidora **previo a su envío al navegador del usuario**. El cliente recibe un documento HTML final listo para su visualización, en lugar de un conjunto de scripts que requieran ser procesados para construir la interfaz.

### Pasos del Flujo SSR

```
1. El usuario navega hacia: http://mitienda.com/productos

2. El navegador emite una solicitud HTTP GET con destino al servidor

3. El servidor web (Apache/Nginx) intercepta la petición

4. El servidor procesa el código fuente (PHP/Python/Java):
   - Consulta al motor de base de datos: SELECT * FROM productos
   - Aplica las reglas del negocio (filtrado, ordenación de datos)
   - Construye dinámicamente el marcado HTML con la información recuperada

5. El servidor envía el documento HTML final al navegador cliente:
   <html>
     <body>
       <h1>Catálogo de Productos</h1>
       <div class="producto">Laptop Lenovo - S/ 2499.99</div>
       <div class="producto">Monitor LG - S/ 899.50</div>
     </body>
   </html>

6. El navegador procesa y muestra el HTML recibido → Pantalla visible para el usuario
```

### Cuadro Comparativo: SSR frente a SPA (Single Page Application)

| Característica | SSR (Renderizado en Servidor) | SPA (Client Side Rendering) |
|---|---|---|
| ¿Dónde se procesa el HTML? | Directamente en el servidor | En el cliente mediante JavaScript |
| Indexación SEO |  Óptima (HTML estructurado desde el origen) | ️ Exige configuraciones especiales |
| Tiempo de carga inicial |  Ágil (documento renderizado listo) | ️ Más lento (requiere descargar módulos JS) |
| Dinamismo e interacción | ️ Implica recarga de página |  Fluida y sin refresco visual |
| Exigencia en el servidor | Mayor carga de cómputo | Menor esfuerzo en el servidor |
| Tecnologías habituales | PHP, Django, Laravel, Rails | React, Vue, Angular |

---

## 4. Lenguajes y Marcos de Trabajo Backend

El ecosistema de lenguajes y frameworks para el lado del servidor es amplio y diverso. La selección de un stack tecnológico particular depende del propósito del proyecto, el perfil del equipo de desarrollo, las métricas de rendimiento esperadas y las preferencias técnicas:

### Cuadro Comparativo de Entornos Backend

| Lenguaje | Framework Principal | Fortalezas Clave | Ámbitos de Aplicación |
|---|---|---|---|
| **PHP** | Laravel, Symfony | Alta disponibilidad de hosting, ecosistema web maduro | CMS, plataformas de e-commerce, apps web |
| **Python** | Django, FastAPI, Flask | Sintaxis clara, integración con ciencia de datos e IA | Desarrollo de APIs, Machine Learning, startups |
| **Java** | Spring Boot | Solidez de nivel empresarial, alto rendimiento | Sector bancario, plataformas corporativas |
| **JavaScript** | Express, NestJS | Código isomórfico (mismo lenguaje en cliente y servidor) | Arquitecturas de microservicios, tiempo real |
| **Go** | Gin, Fiber | Desempeño excepcional, alta concurrencia | Servicios web de tráfico masivo |
| **Ruby** | Rails | Elevada velocidad de desarrollo, convención sobre configuración | Startups, construcción ágil de prototipos |
| **C#** | ASP.NET Core | Integración con el ecosistema Microsoft, Enterprise | Entornos Windows, soluciones Cloud en Azure |

---

## 5. Desarrollo de Aplicaciones Web con PHP

**PHP (PHP: Hypertext Preprocessor)** fue concebido desde sus orígenes como un lenguaje de programación interpretado orientado a la creación de aplicaciones en el lado del servidor. Su trayectoria y principales hitos incluyen:

### Evolución Histórica de PHP

- **1994:** Rasmus Lerdorf desarrolla las "Personal Home Page Tools" para dar seguimiento a las visitas de su currículum en línea.
- **1997:** Presentación de PHP 3.0, reescrito por Zeev Suraski y Andi Gutmans, añadiendo conectividad a bases de datos.
- **2000:** Lanzamiento de PHP 4.0 impulsado por el motor Zend Engine, mejorando substancialmente el procesamiento.
- **2004:** Llegada de PHP 5.0 con soporte robusto para la Programación Orientada a Objetos.
- **2015:** Publicación de PHP 7.0 con un salto cuantitativo de rendimiento (duplicando la velocidad de PHP 5.6) y declaraciones de tipos.
- **2020:** Adopción de PHP 8.0 introduciendo el compilador JIT, la expresión `match`, argumentos nombrados y el operador `nullsafe`.
- **2022:** Versión PHP 8.2 agregando *readonly properties* y soporte de *Fibers* para concurrencia asíncrona.

### PHP Integrado en Documentos HTML

PHP posee la capacidad de embeberse directamente en bloques de marcado HTML, cualidad que facilitó su masiva adopción por los desarrolladores web desde sus primeros años:

```php
<!DOCTYPE html>
<html>
<body>
    <h1>Bienvenido, <?php echo htmlspecialchars($usuario->nombre); ?></h1>
    
    <?php if ($usuario->estaAutenticado()): ?>
        <p>Tienes <?php echo $usuario->mensajes->count(); ?> mensajes nuevos.</p>
    <?php else: ?>
        <a href="/login">Iniciar sesión</a>
    <?php endif; ?>
</body>
</html>
```

### Presencia de PHP en la Web Global

PHP respalda a más del **77% de las plataformas web** cuyo lenguaje de servidor es identificable (según métricas de W3Techs). Soluciones globales de la talla de **WordPress** (que abarca el 43% de los sitios web), **Wikipedia**, **Facebook** (mediante Hack, dialecto de PHP) y múltiples herramientas de comercio electrónico basan su infraestructura en PHP.

---

## 6. Aplicaciones Web con JSP (JavaServer Pages)

**JSP (JavaServer Pages)** constituye la propuesta del ecosistema Java para el desarrollo de sitios web dinámicos renderizados en el servidor. Forma parte de la plataforma **Java EE (Jakarta EE)**, la suite de especificaciones empresariales de Java.

### Arquitectura de JSP y el Contenedor Apache Tomcat

Los componentes JSP se ejecutan en un **servidor de aplicaciones Java** como **Apache Tomcat**, **JBoss/WildFly** o **GlassFish**. A diferencia de PHP (que funciona como lenguaje interpretado), JSP transforma sus archivos a **Servlets Java** durante la primera petición efectuada:

```
Petición HTTP
    │
    ▼
Apache Tomcat (Servlet Container)
    │
    ├── Primera vez: compila archivo.jsp → Servlet Java (.class)
    │
    ├── Subsiguientes: ejecuta el Servlet ya compilado
    │
    ▼
Respuesta HTML generada
```

### Comparativo Técnico: JSP frente a PHP

| Criterio | PHP | JSP |
|---|---|---|
| **Curva de aprendizaje** | Inmediata | Exigente (requiere dominio de Java) |
| **Rendimiento** | Destacado (PHP 8 con JIT) | Excepcional (optimización en la JVM) |
| **Enfoque principal** | Desarrollo web general | Soluciones corporativas (ERP, finanzas) |
| **Infraestructura de servidor** | Apache/Nginx con PHP-FPM | Apache Tomcat, WildFly |
| **Sistema de tipos** | Dinámico (con opción a tipado estricto) | Estático y fuertemente tipado |
| **Uso prevalente** | Comercio electrónico, CMS | Sector bancario, instituciones gubernamentales |

### Desarrollo Empresarial con Java EE / Jakarta EE

La oferta tecnológica de Java para la industria sobrepasa el ámbito de JSP. **Spring Boot** (el marco de trabajo Java más utilizado actualmente) simplifica de forma notable la construcción de servicios y sistemas robustos, constituyendo el estándar por excelencia en la banca, la industria de telecomunicaciones y el sector público en el Perú y la región.

---

## 7. Reflexión Personal sobre la Transición de Frontend a Backend

Completar la novena semana, habiendo superado el examen parcial, representó un valioso momento de evaluación personal. El contenido desarrollado invitó a adoptar una mirada más amplia: migrar de una perspectiva enfocada en PHP a comprender la diversidad del ecosistema tecnológico global.

Lo más estimulante fue tomar conciencia de la **amplitud del panorama backend**. Al comenzar en el área de desarrollo web, se suele asumir que existe un método único para resolver cada necesidad. Esta semana dejó claro que PHP, Python, Java, Go y JavaScript son alternativas idóneas, ofreciendo ventajas particulares en función del escenario.

Como estudiante de Ingeniería de Sistemas en la UNCP, esta visión integrada cobra enorme significado, puesto que el mercado profesional en el Perú demanda especialistas capacitados **tanto en la pila PHP/Laravel** (ampliamente extendida en las PYMEs y el e-commerce local) como en el **entorno Java** (fundamental en el sector financiero, gubernamental y corporativo). Aprender arquitectura de software por encima de un lenguaje específico garantiza una sólida adaptabilidad profesional.

Asimismo, la próxima introducción a Python para la segunda etapa despierta gran motivación: se trata de un lenguaje referente en áreas clave como la inteligencia artificial y el análisis masivo de datos, campos con un horizonte de expansión sobresaliente en nuestro país.
