# Semana 6: Manejo de Dependencias Backend con Composer y APIs RESTful Básicas

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 11 de mayo – 15 de mayo de 2026  
**Herramientas:** Composer Package Manager, JSON API, Postman  

---

## 1. Composer y el Gestor de Dependencias

### El Problema antes de Composer

Previo al surgimiento de Composer, incorporar módulos de terceros en proyectos PHP exigía un esfuerzo manual altamente susceptible a fallos: descargar archivos en formato ZIP, mover directorios dentro de la estructura del proyecto, administrar las actualizaciones a mano y confiar en que no ocurrieran incompatibilidades entre las librerías. Esta metodología no resultaba viable para el desarrollo de software a nivel profesional.

### ¿Qué es Composer?

**Composer** es la herramienta estándar para la gestión de dependencias en el ecosistema PHP, desempeñando una función análoga a la de `npm` en Node.js o `pip` en Python. Facilita la declaración de los paquetes requeridos por una aplicación, encargándose de su descarga, instalación e integración de forma automatizada y reproducible.

Composer obtiene los paquetes desde el repositorio oficial **Packagist** (https://packagist.org).

### El archivo `composer.json`

El punto neurálgico en todo proyecto administrado por Composer es el fichero **`composer.json`**, el cual define la información descriptiva de la aplicación junto a su listado de dependencias:

```json
{
    "name": "vascoqori/portafolio-web",
    "description": "Portafolio académico - Desarrollo de Aplicaciones Web - UNCP",
    "type": "project",
    "require": {
        "php": ">=8.1",
        "vlucas/phpdotenv": "^5.5",
        "monolog/monolog": "^3.4",
        "ramsey/uuid": "^4.7"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    }
}
```

### Comandos Fundamentales de Composer

| Comando | Descripción |
|---|---|
| `composer init` | Configura interactivamente un nuevo proyecto de Composer |
| `composer install` | Descarga las versiones exactas registradas en `composer.lock` |
| `composer update` | Actualiza las librerías hacia la versión más reciente según reglas |
| `composer require vendor/paquete` | Incorpora una nueva biblioteca al proyecto |
| `composer require --dev vendor/paquete` | Añade un paquete exclusivo para la fase de desarrollo |
| `composer dump-autoload` | Regenera el mapa y los archivos de carga automática |

### El archivo `composer.lock`

El archivo **`composer.lock`** almacena el registro exacto de las versiones que se instalaron en el entorno. Cuando cualquier miembro del equipo (o un servidor de despliegue) ejecuta `composer install`, se garantiza la descarga de esas mismas versiones, asegurando la **paridad y reproducibilidad** del entorno de trabajo. **Este archivo debe formar parte del repositorio en el control de versiones** (Git).

### PSR-4 y el Autoloading

**PSR-4** representa una norma establecida por el PHP-FIG (PHP Framework Interoperability Group) para asociar la estructura de espacios de nombres (namespaces) con la distribución física de archivos. Siguiendo el esquema del ejemplo:

- La clase `App\Controllers\ProductoController` debe ubicarse en la ruta `app/Controllers/ProductoController.php`.
- La clase `App\Models\Producto` debe residir en `app/Models/Producto.php`.

Al incluir la sentencia `require_once 'vendor/autoload.php'`, PHP resolverá y cargará de forma automática cualquier clase solicitada, eliminando la necesidad de invocar múltiples sentencias `include` o `require` de manera manual.

---

## 2. Arquitectura de Servicios Web RESTful

**REST (Representational State Transfer)** constituye un estilo de diseño arquitectónico enfocado en la creación de servicios web utilizando las características del protocolo HTTP. Una API construida bajo estos lineamientos se conoce como **RESTful**.

### Principios de REST

1. **Interfaz Estandarizada:** Las URLs sirven como identificadores de recursos, mientras que los verbos HTTP determinan la acción esperada.
2. **Ausencia de Estado (Stateless):** Cada consulta es independiente; el servidor no retiene el estado de la interacción entre peticiones del cliente.
3. **Desacoplamiento Cliente-Servidor:** Separación estricta entre la entidad receptora de datos (cliente) y la suministradora (servidor).
4. **Capacidad de Almacenamiento en Caché:** Las respuestas emitidas pueden señalarse como almacenables en caché para optimizar el desempeño.

### Verbos HTTP y su Semántica

| Verbo HTTP | Operación CRUD | Ejemplo de Endpoint | Descripción de la Acción |
|---|---|---|---|
| `GET` | Read (Lectura) | `GET /productos` | Recuperar la lista completa de elementos |
| `GET` | Read (Lectura) | `GET /productos/5` | Consultar un elemento en específico |
| `POST` | Create (Creación) | `POST /productos` | Registrar un recurso nuevo |
| `PUT` | Update (Reemplazo total) | `PUT /productos/5` | Sobrescribir todo el contenido del recurso |
| `PATCH` | Update (Modificación parcial) | `PATCH /productos/5` | Modificar únicamente campos seleccionados |
| `DELETE` | Delete (Eliminación) | `DELETE /productos/5` | Eliminar el recurso del sistema |

### Convenciones de Diseño de Endpoints

- **Uso de sustantivos en plural:** `/productos` en lugar de `/producto`.
- **Enfoque en recursos, no en acciones:** `/productos/5` en vez de `/obtener-producto?id=5`.
- **Jerarquía de entidades relacionadas:** `/categorias/3/productos` (obtiene productos pertenecientes a la categoría 3).
- **Gestión de versiones:** `/api/v1/productos` para garantizar la compatibilidad ante cambios futuros.

---

## 3. Serialización de Datos y Respuestas JSON

**JSON (JavaScript Object Notation)** representa el estándar predilecto para la transmisión de información en APIs REST modernas. Es un formato legible por personas, ligero en tamaño y compatible de forma nativa con casi la totalidad de lenguajes de programación.

### Estructura de una Respuesta JSON Bien Formateada

Una API con estándares profesionales no se limita a entregar los datos brutos; adjunta metadatos con el estado operativo del procesamiento:

```php
<?php
declare(strict_types=1);

/**
 * Clase de soporte para estandarizar las respuestas JSON de la API.
 */
class JsonResponse {

    /**
     * Emite una respuesta satisfactoria en formato JSON incluyendo la carga de datos.
     */
    public static function exito(
        mixed $datos,
        string $mensaje = 'Operación procesada con éxito',
        int    $codigo  = 200,
        array  $meta    = []
    ): void {
        http_response_code($codigo);

        // Encabezados HTTP requeridos para entregar contenido JSON
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: no-cache, no-store, must-revalidate');

        // Esquema estructurado para la respuesta satisfactoria
        $respuesta = [
            'status'  => 'success',
            'codigo'  => $codigo,
            'mensaje' => $mensaje,
            'datos'   => $datos,
        ];

        if (!empty($meta)) {
            $respuesta['meta'] = $meta;
        }

        echo json_encode($respuesta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Emite una respuesta de fallo o error en formato JSON.
     */
    public static function error(
        string $mensaje,
        int    $codigo  = 400,
        array  $errores = []
    ): void {
        http_response_code($codigo);
        header('Content-Type: application/json; charset=utf-8');

        $respuesta = [
            'status'  => 'error',
            'codigo'  => $codigo,
            'mensaje' => $mensaje,
        ];

        if (!empty($errores)) {
            $respuesta['errores'] = $errores;
        }

        echo json_encode($respuesta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}

// --- Ejemplo de integración en un controlador de productos ---

// Simulación de fuente de datos (en producción se obtendría mediante la capa de Modelo/BD)
$productos = [
    ['id' => 1, 'nombre' => 'Laptop Lenovo',    'precio' => 2499.99, 'stock' => 10],
    ['id' => 2, 'nombre' => 'Monitor LG 27"',   'precio' => 899.50,  'stock' => 5],
    ['id' => 3, 'nombre' => 'Teclado Mecánico', 'precio' => 349.00,  'stock' => 20],
];

// Generación de respuesta JSON exitosa para la consulta GET /api/v1/productos
JsonResponse::exito(
    datos: $productos,
    mensaje: 'Lista de productos recuperada correctamente',
    codigo: 200,
    meta: [
        'total'       => count($productos),
        'pagina'      => 1,
        'por_pagina'  => 15,
        'version_api' => 'v1'
    ]
);

/*
Salida JSON producida:
{
    "status": "success",
    "codigo": 200,
    "mensaje": "Lista de productos recuperada correctamente",
    "datos": [
        {"id": 1, "nombre": "Laptop Lenovo", "precio": 2499.99, "stock": 10},
        ...
    ],
    "meta": {
        "total": 3,
        "pagina": 1,
        "por_pagina": 15,
        "version_api": "v1"
    }
}
*/
```

### Códigos de Estado HTTP Comunes en APIs

| Código | Nombre Oficial | Escenario de Uso |
|---|---|---|
| `200 OK` | Éxito | Peticiones GET, PUT o PATCH completadas sin inconvenientes |
| `201 Created` | Creado | Petición POST que culmina con la creación de un nuevo recurso |
| `204 No Content` | Sin Contenido | Petición DELETE procesada exitosamente sin datos que retornar |
| `400 Bad Request` | Petición Incorrecta | La solicitud contiene datos mal estructurados o con errores |
| `401 Unauthorized` | No Autorizado | Se requiere autenticar la identidad antes de proceder |
| `403 Forbidden` | Prohibido | El usuario está identificado pero carece de permisos suficientes |
| `404 Not Found` | No Encontrado | El recurso o endpoint solicitado no existe |
| `422 Unprocessable Entity` | Entidad Inprocesable | Estructura correcta pero con fallas en las reglas de validación |
| `500 Internal Server Error` | Error Interno | Inconveniente no previsto ocurrido en el servidor |

---

## 4. ¿Qué se aprendió?

Esta unidad integró conceptos esenciales en la gestión de proyectos PHP y el desarrollo de servicios interconectados:

- **Composer como pilar de desarrollo:** Comprensión de que el flujo de trabajo moderno en PHP se fundamenta en Composer, relegando la gestión manual de archivos de librerías.

- **Estandarización PSR-4 y espacios de nombres:** Comprensión del uso de namespaces y del autoload de Composer para prescindir de llamadas `require` manuales, manteniendo el código limpio y libre de redundancias.

- **REST como directriz de comunicación:** Se aprendió que REST propone una serie de pautas que, al aplicarse rigurosamente, garantizan la construcción de interfaces limpias, comprensibles e interactivas para cualquier cliente informático.

- **JSON como estándar de datos:** Práctica en la estructuración de respuestas en formato JSON acompañadas de metadatos informativos, cabeceras HTTP de respuesta y códigos de estado congruentes.

---

## 5. ¿Cómo se aplicó?

Las dinámicas prácticas llevadas a cabo en la semana consistieron en:

1. **Inicialización de Composer:** Ejecución del comando `composer init` sobre el proyecto del portafolio, configurando la estructura inicial de `composer.json` y registrando el autoloader bajo la convención PSR-4.

2. **Incorporación del paquete Monolog:** Instalación de la dependencia `monolog/monolog` mediante `composer require`, preparando un Logger para registrar eventos del sistema en bitácoras rotativas diarias.

3. **Manejo de variables con PHPDotEnv:** Integración de `vlucas/phpdotenv` para administrar variables de configuración del sistema (credenciales de BD, llaves secretas) a través de un archivo `.env` fuera del control de versiones.

4. **Desarrollo de API REST para Productos:** Creación de una API REST básica utilizando PHP Vanilla con soporte para los servicios `GET /api/v1/productos` y `GET /api/v1/productos/{id}`, empleando `JsonResponse` para homologar la estructura de salida.

5. **Validación de endpoints en Postman:** Configuración de pruebas sobre Postman para inspeccionar la respuesta de la API, verificando encabezados HTTP, carga de datos JSON y la asignación adecuada de códigos de estado HTTP.
