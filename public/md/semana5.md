# Semana 5: Patrón Arquitectónico de Diseño MVC (Modelo-Vista-Controlador)

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 04 de mayo – 08 de mayo de 2026  
**Herramientas:** MVC Pattern, Software Architecture, PHP Vanilla  

---

## 1. Principio de Separación de Responsabilidades

El **Patrón MVC (Modelo-Vista-Controlador)** constituye un modelo de arquitectura de software que descompone una aplicación en tres bloques funcionalmente independientes, cada uno asignado a un rol específico. Esta segmentación aplica la directriz de **Separación de Intereses (SoC - Separation of Concerns)**, la cual dicta que cada módulo debe enfocarse exclusivamente en una tarea determinada dentro del sistema.

### El Modelo (Model)

El **Modelo** abarca el componente encargado de los datos y las reglas operativas de la aplicación. Sus responsabilidades consisten en:

- **Gestionar el acceso y la edición en la base de datos** (consultas SQL procesadas vía PDO).
- **Encapsular la lógica del negocio** (validación de campos, operaciones matemáticas, procesamiento de información).
- **Informar las modificaciones** a los observadores suscritos (en arquitecturas orientadas a eventos).

El modelo **desconoce por completo la forma en que los datos se presentan** de cara al usuario final. Carece de vínculos con HTML, CSS o elementos del diseño de interfaz.

### La Vista (View)

La **Vista** constituye la capa encargada de la interfaz gráfica. Se ocupa de:

- **Construir y desplegar la pantalla** mediante la combinación de HTML, CSS y JavaScript.
- **Exhibir los datos** suministrados directamente por el Controlador.
- **Mantenerse libre de reglas de negocio.** Únicamente incluye lógica esencial para la presentación (bucles iterativos para recorrer colecciones, condiciones simples para alternar visibilidad).

La vista **no interactúa directamente con el motor de base de datos**. Recibe la información procesada desde el Controlador.

### El Controlador (Controller)

El **Controlador** actúa como punto de enlace entre el Modelo y la Vista. Sus tareas principales abarcan:

- **Capturar las peticiones HTTP** emitidas por los usuarios (URLs, parámetros en GET o POST).
- **Llamar al Modelo** para consultar o modificar la información requerida.
- **Determinar la Vista** correspondiente y transmitirle los datos para su representación.
- **Administrar el flujo de control** en la aplicación.

```
Usuario (Navegador)
    │ HTTP Request
    ▼
┌─────────────┐      Delegaciones       ┌──────────────┐
│ Controlador │ ───────────────────────► │    Modelo    │
│  (Router)   │ ◄─────────────────────── │  (Base BD)   │
└──────┬──────┘      Datos retornados   └──────────────┘
       │
       │ Selecciona y pasa datos
       ▼
┌─────────────┐
│    Vista    │ ──► HTML renderizado ──► Usuario
│   (HTML)    │
└─────────────┘
```

### Beneficios Concretos del MVC

- **Facilidad de Mantenimiento:** Los cambios en el diseño gráfico afectan únicamente a la Vista, mientras que las variaciones en las reglas del negocio impactan solo al Modelo.
- **Trabajo Colaborativo:** Los diseñadores de interfaz pueden construir Vistas en paralelo mientras los desarrolladores de backend crean los Modelos.
- **Facilidad de Pruebas (Testabilidad):** El Modelo puede evaluarse de manera aislada mediante pruebas unitarias sin depender del navegador web.
- **Escalabilidad del Sistema:** Cada capa puede evolucionar e incrementarse independientemente.

---

## 2. El Front Controller y Reescritura de URLs

### El Problema de los URLs Tradicionales

En los esquemas tradicionales de desarrollo en PHP sin emplear MVC, cada ruta o vista equivale a un archivo PHP independiente:

```
http://localhost/listar-productos.php
http://localhost/ver-producto.php?id=5
http://localhost/agregar-al-carrito.php?producto_id=5
```

Este esquema acarrea duplicidad de código (cada script debe abrir la conexión a la BD, validar credenciales de sesión, etc.) y genera direcciones poco amigables y vulnerables (al revelar la estructura de archivos en el servidor).

### El Patrón Front Controller

El patrón **Front Controller** (Controlador Frontal) instaura un canal de entrada único para atender todas las solicitudes del sistema. En lugar de mantener múltiples páginas PHP independientes, existe un archivo central `index.php` encargado de recibir **todas** las peticiones e instruir al controlador y a la acción pertinente.

### Configuración de `mod_rewrite` y `.htaccess`

Con el fin de lograr que el servidor Apache derive la totalidad de solicitudes hacia `index.php`, se activa y configura la herramienta `mod_rewrite` dentro del archivo **`.htaccess`**:

```apacheconf
# Archivo: public/.htaccess

# Habilitar el módulo de reescritura de URLs
RewriteEngine On

# Condición: ejecutar solo si la solicitud NO corresponde a un archivo existente
RewriteCond %{REQUEST_FILENAME} !-f
# Condición: ejecutar solo si la solicitud NO corresponde a un directorio existente
RewriteCond %{REQUEST_FILENAME} !-d

# Regla: canalizar CUALQUIER ruta hacia index.php adjuntando la URI mediante parámetro
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

Mediante este ajuste, cualquier llamada hacia `http://localhost/productos/detalle/5` provoca que Apache dirija el flujo a `index.php`, entregando `$_GET['url'] = 'productos/detalle/5'`. De esta forma, el Router escrito en PHP analiza la ruta para decidir qué Controlador y método ejecutar.

---

## 3. Sistema de Enrutamiento y Despacho

El **Router** es la pieza central dentro de una arquitectura MVC responsable de mapear las direcciones URL con sus respectivos controladores y métodos. Sus funciones operativas son:

1. Interpretar la URL entrante.
2. Contrastarla con las rutas previamente definidas.
3. Instanciar la clase del Controlador adecuado y ejecutar el método asignado.

```php
<?php
declare(strict_types=1);

/**
 * Clase Router: módulo de enrutamiento principal del Front Controller.
 * Asocia peticiones URL con sus respectivos Controladores y Acciones.
 */
class Router {
    /** @var array Registro interno de rutas: [método => [patrón => [controlador, acción]]] */
    private array $rutas = [];

    /**
     * Da de alta una ruta dentro del sistema.
     *
     * @param string $metodo      Método HTTP: GET, POST, PUT, DELETE.
     * @param string $patron      Estructura de la URL, ej: '/productos/{id}'.
     * @param string $controlador Nombre de la clase del controlador.
     * @param string $accion      Nombre del método a llamar dentro del controlador.
     */
    public function registrar(
        string $metodo,
        string $patron,
        string $controlador,
        string $accion
    ): void {
        $this->rutas[strtoupper($metodo)][$patron] = [
            'controlador' => $controlador,
            'accion'      => $accion
        ];
    }

    // Métodos abreviados para peticiones HTTP frecuentes
    public function get(string $patron, string $controlador, string $accion): void {
        $this->registrar('GET', $patron, $controlador, $accion);
    }

    public function post(string $patron, string $controlador, string $accion): void {
        $this->registrar('POST', $patron, $controlador, $accion);
    }

    /**
     * Procesa la solicitud actual para dirigirla al controlador y método requeridos.
     * Transforma patrones dinámicos (/productos/{id}) a expresiones regulares.
     */
    public function despachar(): void {
        $metodoHttp = strtoupper($_SERVER['REQUEST_METHOD']);
        $urlSolicit  = '/' . trim($_GET['url'] ?? '', '/');

        $rutasDelMetodo = $this->rutas[$metodoHttp] ?? [];

        foreach ($rutasDelMetodo as $patron => $destino) {
            // Convertir parámetros de plantilla {param} en bloques de captura de expresión regular
            $regex = preg_replace('/\{([a-zA-Z_]+)\}/', '([^/]+)', $patron);
            $regex = "@^{$regex}$@";

            if (preg_match($regex, $urlSolicit, $coincidencias)) {
                array_shift($coincidencias); // Omitir el valor total de la coincidencia

                $claseControlador = $destino['controlador'];
                $metodoAccion     = $destino['accion'];

                // Instanciar la clase controladora y llamar la acción pasando los argumentos capturados
                $controlador = new $claseControlador();
                call_user_func_array([$controlador, $metodoAccion], $coincidencias);
                return;
            }
        }

        // En caso de no existir coincidencias de ruta, responder con código 404
        http_response_code(404);
        require_once __DIR__ . '/../views/errors/404.php';
    }
}

// --- Definición e inicialización de rutas en index.php ---
$router = new Router();

// Endpoints de Productos
$router->get('/',                      'ProductoController', 'index');
$router->get('/productos',             'ProductoController', 'listar');
$router->get('/productos/{id}',        'ProductoController', 'mostrar');
$router->get('/productos/crear',       'ProductoController', 'crear');
$router->post('/productos',            'ProductoController', 'guardar');
$router->get('/productos/{id}/editar', 'ProductoController', 'editar');
$router->post('/productos/{id}',       'ProductoController', 'actualizar');
$router->get('/productos/{id}/borrar', 'ProductoController', 'eliminar');

// Endpoints de Control de Acceso
$router->get('/login',  'AuthController', 'mostrarLogin');
$router->post('/login', 'AuthController', 'procesarLogin');
$router->get('/logout', 'AuthController', 'logout');

// Ejecución del despacho de la petición
$router->despachar();
```

---

## 4. ¿Qué se aprendió?

Esta jornada representó uno de los pilares formativos clave del período:

- **Adopción de MVC como paradigma arquitectónico:** Se comprendió que el patrón MVC trasciende la simple distribución de archivos, constituyendo un marco que promueve el orden del código y la delimitación de funciones. Cada componente posee una tarea única.

- **Ventajas del Front Controller:** Se asimiló la razón por la que encauzar el tráfico mediante una puerta de acceso centralizada (`index.php`) supera ampliamente a la estrategia tradicional de múltiples ficheros script, tanto en organización como en medidas de seguridad.

- **Reescritura de direcciones mediante mod_rewrite:** Aprendizaje enfocado en la preparación de Apache para producir URLs limpias y comprensibles (beneficiosas para SEO y usabilidad), enmascarando los caminos internos del servidor.

- **Estructuración de Routers:** Comprensión profunda del mecanismo interno de un Router: la relación entre plantillas de URL y sus manejadores, así como la captura dinámica de variables contenidas en las rutas.

---

## 5. ¿Cómo se aplicó?

Las actividades aplicadas desarrolladas durante esta semana abarcaron:

1. **Construcción de una estructura MVC desde cero:** Creación del árbol de carpetas del sistema (`app/controllers/`, `app/models/`, `app/views/`, `public/`, `config/`) e implementación del sistema de carga automática (autoloader).

2. **Desarrollo del componente Router:** Programación de la clase `Router` con capacidad de procesar parámetros dinámicos en las URLs mediante el empleo de patrones regex.

3. **Creación de un CRUD completo en MVC:** Construcción integral del módulo de Productos implementando la separación de capas: `ProductoModel` gestionaba las consultas PDO, `ProductoController` coordinaba los datos y la lógica de flujo, y los plantillas en `views/productos/` generaban la salida HTML.

4. **Habilitación de reglas en .htaccess:** Ajuste de directivas de reescritura en Apache para hacer pasar las peticiones a través de `index.php`, comprobando el funcionamiento correcto al navegar con rutas amigables como `/productos/5`.
