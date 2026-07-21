# Semana 1: Introducción al Entorno de Desarrollo y Configuración del Servidor Local

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 06 de abril – 10 de abril de 2026  
**Herramientas:** VS Code, XAMPP, PHP 8.x  

---

## 1. Introducción a la Arquitectura del Servidor Local

Previo a escribir cualquier fragmento de código PHP, resulta esencial comprender el funcionamiento interno de un servidor web en un entorno local, así como la responsabilidad asignada a cada componente del sistema. Al desarrollar dentro de una máquina de pruebas sin depender de internet, es necesario simular fielmente el entorno de producción para garantizar un comportamiento predecible del software.

### El Concepto de Loopback y la Dirección 127.0.0.1

La dirección IP **127.0.0.1** recibe el nombre de interfaz de *loopback* o bucle local. Se trata de un direccionamiento reservado dentro del protocolo TCP/IP destinado a señalar al propio equipo. Al procesar una solicitud enviada a `127.0.0.1`, el sistema operativo no la redirige a la red externa, sino que la gestiona internamente. El alías más extendido de esta dirección es `localhost`, el cual corresponde a una resolución de nombre contenida en el archivo `hosts` del sistema (`C:\Windows\System32\drivers\etc\hosts` en plataformas Windows).

### El Rol de Apache HTTP Server

**Apache** figura entre los servidores web de código abierto más populares del sector. Su objetivo primordial radica en **escuchar las solicitudes HTTP entrantes a través del puerto 80** (o HTTPS mediante el 443) y determinar la respuesta adecuada. Dentro de un entorno de pruebas gestionado con XAMPP, el rol de Apache abarca:

- Atender las peticiones realizadas desde el navegador local hacia `localhost`.
- Examinar la ruta solicitada para identificar el recurso correspondiente en el disco duro.
- Transferir el procesamiento al intérprete de PHP cuando la extensión del archivo sea `.php`, evitando enviar el código fuente de forma directa.
- Responder al cliente entregando el resultado final formateado como código HTML estándar.

### El Rol del Intérprete PHP

**PHP (PHP: Hypertext Preprocessor)** opera como un lenguaje de programación ejecutado en el servidor. Esto implica que las líneas de código PHP **jamás son transmitidas al navegador web**; en su lugar, este solo recibe el resultado HTML generado por la ejecución del script. Apache efectúa la llamada al motor de PHP mediante el módulo `mod_php`, el cual procesa las instrucciones y retorna un flujo de datos en formato HTML.

---

## 2. Instalación de Herramientas Base: XAMPP y VS Code

### ¿Qué es XAMPP?

**XAMPP** constituye una suite de software libre distribuida por Apache Friends, ideada para integrar en un único paquete los componentes esenciales que estructuran un entorno local de desarrollo web:

| Componente | Función |
|---|---|
| **X** | Compatibilidad multiplataforma (Windows, Linux, macOS) |
| **A** — Apache | Servidor de peticiones HTTP |
| **M** — MariaDB/MySQL | Sistema gestor de bases de datos relacionales |
| **P** — PHP | Motor de ejecución del lenguaje PHP |
| **P** — Perl | Intérprete para el lenguaje Perl |

### El Directorio `htdocs`

Al instalar la suite XAMPP en Windows, el directorio predeterminado suele ser `C:\xampp`. El directorio fundamental para el trabajo diario es **`C:\xampp\htdocs`**, el cual opera como la *raíz de publicaciones del servidor web* (document root). Todos los archivos o subcarpetas ubicados en dicha ruta estarán disponibles mediante el navegador a través de la URL `http://localhost/nombre-del-archivo`.

Por ejemplo:
- `C:\xampp\htdocs\mi-proyecto\index.php` → `http://localhost/mi-proyecto/`
- `C:\xampp\htdocs\prueba.php` → `http://localhost/prueba.php`

### Visual Studio Code como Editor

**VS Code** representa el entorno de desarrollo y edición de código creado por Microsoft, posicionado ampliamente como la opción predilecta en el desarrollo web. Entre las extensiones fundamentales configuradas para potenciar el flujo de trabajo con PHP destacan:

- **PHP Intelephense** — brinda autocompletado avanzado, navegación de métodos y análisis estático de errores en PHP.
- **PHP Debug** — facilita la integración con Xdebug para llevar a cabo depuración interactiva paso a paso.
- **Prettier** — estandariza y aplica formato automatizado al código.
- **GitLens** — amplía las capacidades de inspección sobre el historial del repositorio Git.

---

## 3. Ciclo de Vida de una Petición HTTP del Lado del Servidor

Comprender el recorrido integral que realiza una solicitud web constituye una competencia clave para todo desarrollador backend. La secuencia completa transcurre de la siguiente manera:

```
Navegador (Cliente)
    │
    │  1. GET http://localhost/index.php
    ▼
Apache HTTP Server (Puerto 80)
    │
    │  2. Identifica extensión .php → delega al módulo PHP
    ▼
Intérprete PHP
    │
    │  3. Ejecuta el código PHP, puede consultar MySQL
    ▼
Respuesta generada (HTML puro)
    │
    │  4. Apache envía la respuesta con código HTTP 200 OK
    ▼
Navegador (Cliente)
    │
    │  5. Renderiza el HTML recibido
    ▼
Página visible para el usuario
```

### Los Métodos HTTP Principales

- **GET**: Solicita la recuperación de un recurso. Transmite sus parámetros embebidos en la misma URL (`?nombre=valor`) y no modifica el estado en el servidor.
- **POST**: Transfiere información hacia el servidor dentro del cuerpo del mensaje. Se emplea comúnmente en el procesamiento de formularios.
- **PUT/PATCH**: Actualiza la información de un recurso ya existente.
- **DELETE**: Remueve o elimina un recurso especificado.

Los códigos de respuesta HTTP más habituales comprenden: `200 OK`, `301 Moved Permanently`, `404 Not Found` y `500 Internal Server Error`.

---

## 4. Variables de Entorno y PHP.ini

El comportamiento operativo del motor PHP se halla supeditado a las directivas de un archivo central de configuración denominado **`php.ini`**, localizado en `C:\xampp\php\php.ini`. En este documento se ajustan cientos de opciones que regulan la gestión de fallos, límites de asignación de memoria, la zona horaria global y aspectos de seguridad.

### Directivas Fundamentales

| Directiva | Valor recomendado (dev) | Descripción |
|---|---|---|
| `display_errors` | `On` | Visualiza los errores en pantalla (exclusivo para entornos de prueba) |
| `error_reporting` | `E_ALL` | Notifica todos los niveles y severidades de error |
| `date.timezone` | `America/Lima` | Define la zona horaria por defecto en funciones de fecha |
| `max_execution_time` | `30` | Tiempo máximo permitido para la ejecución de un script (en segundos) |
| `memory_limit` | `128M` | Consumo de memoria límite por cada script en ejecución |
| `upload_max_filesize` | `2M` | Peso máximo admisible al subir archivos al servidor |

### Configuración Dinámica con `ini_set()`

Más allá de modificar globalmente el archivo `php.ini`, PHP brinda la posibilidad de ajustar ciertas reglas en tiempo de ejecución mediante la función `ini_set()`. Esta característica resulta idónea para aplicar personalizaciones por script sin alterar el comportamiento general del servidor:

```php
<?php
// Configuración del entorno de desarrollo
// Activar visualización de errores en pantalla
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// Reportar TODOS los niveles de error (E_ALL)
error_reporting(E_ALL);

// Configurar zona horaria para Perú (UTC-5)
ini_set('date.timezone', 'America/Lima');
date_default_timezone_set('America/Lima');

// Verificación básica del entorno
echo "<h1>Entorno de Desarrollo Configurado</h1>";
echo "<p>Versión de PHP: " . phpversion() . "</p>";
echo "<p>Fecha/Hora actual: " . date('d/m/Y H:i:s') . "</p>";
echo "<p>Sistema Operativo: " . PHP_OS . "</p>";

// Mostrar información completa del servidor (solo en desarrollo)
// phpinfo();
?>
```

> **Nota importante:** La opción `display_errors = On` **bajo ninguna circunstancia debe habilitarse en entornos de producción**, debido a que expondría rutas internas del sistema, datos de conexión a bases de datos y otros detalles críticos a usuarios no autorizados.

---

## 5. ¿Qué se aprendió?

Durante este primer periodo lectivo se establecieron los fundamentos teóricos y prácticos indispensables para el desarrollo web backend:

- **Comprensión del modelo cliente-servidor:** Se clarificó la distinción entre los procesos ejecutados en el cliente (frontend) y las operaciones realizadas en el servidor (backend), asimilando que la ejecución de PHP es completamente invisible para los usuarios finales.

- **Instalación y configuración del entorno XAMPP:** Se adquirió experiencia en la gestión de servicios como Apache y MySQL mediante el panel de control de XAMPP, validando la ausencia de conflictos en las frecuencias de puertos y analizando los registros de eventos de Apache.

- **Navegación en el sistema de directorios del servidor:** Se reconoció la relevancia estratégica de la carpeta `htdocs` como raíz de los recursos web y cómo el árbol de directorios locales se traduce en direcciones URL en la web.

- **Configuración del intérprete PHP:** Se examinó la estructura del fichero `php.ini` para personalizar los parámetros del motor, aplicando además la función `ini_set()` para la modificación dinámica de parámetros por script.

- **Ciclo de vida HTTP:** Se comprendió la secuencia integral de una transacción web: desde el momento en que se solicita una URL hasta la representación final del código HTML en el navegador.

---

## 6. ¿Cómo se aplicó?

La fase práctica de esta sesión incluyó la realización de las siguientes actividades aplicadas:

1. **Instalación del stack completo:** Se efectuó la descarga y despliegue de XAMPP 8.2 en el equipo local, comprobando la correcta inicialización de Apache y MySQL sin interferencias de puertos.

2. **Creación del primer script PHP:** Se implementó el archivo `index.php` dentro de la ruta `htdocs/portafolio/`, generando una interfaz de bienvenida con la versión del intérprete, la fecha y hora calculada con `date()` y variables del sistema obtenidas con `$_SERVER`.

3. **Exploración de phpinfo():** Se invocó la función `phpinfo()` para revisar las directivas activas en la instancia del servidor, los módulos cargados en memoria y el conjunto de variables de entorno configuradas.

4. **Modificación del php.ini:** Se editaron los valores de `display_errors`, `error_reporting` y `date.timezone`, procediendo con el reinicio de Apache para comprobar la efectividad de las modificaciones.

5. **Inspección del ciclo HTTP con DevTools:** A través de las herramientas de inspección del navegador (sección Red/Network), se verificaron las cabeceras HTTP emitidas y recibidas, identificando el código de respuesta `200 OK`, la cabecera `Content-Type: text/html` y la latencia en la entrega desde el servidor.

Esta primera semana fijó las bases estructurales que darán soporte a los conocimientos desarrollados en las fases subsecuentes del curso.
