export type ClasesDetailSection = {
  title: string;
  text: string;
  code?: string;
};

export type ClasesDetail = {
  week: number;
  title: string;
  subtitle: string;
  date: string;
  sections: ClasesDetailSection[];
  projects?: { name: string; href: string }[];
};

export const clasesDetailsMap: Record<number, ClasesDetail> = {
  1: {
    week: 1,
    title: "Sesión 1: Introducción al Entorno de Desarrollo y Configuración del Servidor Local",
    subtitle: "Instalación de herramientas base, configuración de variables de entorno, ciclo de vida de una petición HTTP del lado del servidor y despliegue del primer script en entorno local.",
    date: "06 de abril - 10 de abril",
    sections: [
      {
        title: "1. Introducción a la Arquitectura del Servidor Local",
        text: "La simulación de un entorno de producción en un computador local es fundamental para el desarrollo web. Un servidor web local procesa las peticiones de red internas usando la dirección IP de loopback (127.0.0.1) o el nombre de host 'localhost'. Esto permite ejecutar e interpretar el código de backend (PHP) y responder con documentos estáticos (HTML/CSS) antes de subirlos a un servidor real."
      },
      {
        title: "2. Instalación de Herramientas Base: XAMPP y VS Code",
        text: "Para configurar el servidor local se utiliza la distribución XAMPP, la cual empaqueta de forma integrada el servidor web Apache, el intérprete del lenguaje PHP y el sistema de base de datos MariaDB (MySQL). La ruta por defecto de publicación es la carpeta '/htdocs'. Los archivos creados en este directorio son compilados por Apache cuando el cliente realiza una petición."
      },
      {
        title: "3. Ciclo de Vida de una Petición HTTP del Lado del Servidor",
        text: "Cuando el navegador solicita una página (ej. http://localhost/proyecto/index.php):\n1. El cliente envía una petición HTTP de tipo GET.\n2. Apache recibe la solicitud, reconoce la extensión '.php' y la delega al motor intérprete de PHP.\n3. El intérprete ejecuta el script de arriba a abajo, procesa la lógica y genera un flujo de salida estructurado.\n4. Apache recibe este flujo (típicamente HTML, JSON o recursos planos) y lo envía de regreso al navegador del cliente."
      },
      {
        title: "4. Variables de Entorno y PHP.ini",
        text: "El archivo 'php.ini' contiene la directiva global de comportamiento de PHP. Durante el desarrollo local es vital habilitar 'display_errors = On' y configurar un nivel estricto de reporte de errores ('error_reporting = E_ALL'). De igual forma, configurar la zona horaria ('date.timezone') evita inconsistencias al registrar fechas en auditorías y bases de datos.",
        code: `// config.php - Configuración local recomendada para desarrollo
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Verificación de variables de entorno del servidor
$serverName = $_SERVER['SERVER_NAME'];
$serverSoftware = $_SERVER['SERVER_SOFTWARE'];
echo "Servidor: " . htmlspecialchars($serverName) . " running on " . htmlspecialchars($serverSoftware);`
      }
    ],
    projects: [
      { name: "Repositorio Vasco Qori — Portfolio Base", href: "https://github.com/vasco140123" }
    ]
  },
  2: {
    week: 2,
    title: "Sesión 2: Estructuras de Control, Tipos de Datos Avanzados y Funciones Nativas",
    subtitle: "Implementación de flujos condicionales lógicos, bucles iterativos optimizados, manipulación avanzada de arreglos estructurados y modularización mediante funciones reutilizables.",
    date: "13 de abril - 17 de abril",
    sections: [
      {
        title: "1. Sistema de Tipos de Datos en PHP Vanilla",
        text: "PHP es un lenguaje de tipado dinámico, pero admite declaraciones explícitas mediante el modo estricto ('declare(strict_types=1)'). Los tipos se clasifican en escalares (bool, int, float, string) y compuestos (arrays y objetos). Los arreglos en PHP son asociativos de forma nativa, comportándose internamente como tablas hash indexadas."
      },
      {
        title: "2. Estructuras de Decisión Lógica",
        text: "Las bifurcaciones condicionales determinan el camino lógico que toma la ejecución del código. Además de las sentencias tradicionales 'if', 'else if' y 'switch', las versiones recientes de PHP (8.x) incorporan la expresión 'match'. A diferencia de switch, 'match' es una expresión directa que retorna un valor, realiza comparaciones estrictas (===) y no requiere sentencias de ruptura (break)."
      },
      {
        title: "3. Bucles Iterativos y su Optimización",
        text: "Para la iteración sobre datos se implementan los bucles 'for', 'while' y, especialmente para colecciones estructuradas, el bucle 'foreach'. El bucle 'foreach' permite desempaquetar la clave y el valor de un arreglo asociativo directamente, optimizando el consumo de memoria al iterar sobre grandes volúmenes de registros."
      },
      {
        title: "4. Modularización mediante Funciones Reutilizables",
        text: "La modularidad se logra encapsulando subalgoritmos en funciones con tipos estrictos definidos para sus parámetros y su valor de retorno. Esto previene errores de tipo en tiempo de ejecución y mejora sustancialmente la legibilidad del código.",
        code: `<?php
declare(strict_types=1);

// Definición de función con tipado estricto (PHP 8.x)
function calcularImporteTotal(float $precio, int $cantidad, float $descuento): float {
    $subtotal = $precio * $cantidad;
    $descuentoAplicado = $subtotal * $descuento;
    return $subtotal - $descuentoAplicado;
}

// Ejemplo de Match Expression
$categoria = 'tecnologia';
$descuentoPorcentaje = match ($categoria) {
    'tecnologia' => 0.15,
    'muebles' => 0.10,
    default => 0.05
};

$total = calcularImporteTotal(1250.00, 2, $descuentoPorcentaje);
echo "Total a pagar: S/ " . number_format($total, 2);`
      }
    ],
    projects: [
      { name: "Desarrollo web - Script de Prueba de Algoritmia", href: "https://github.com/vasco140123/semana-6-aplicacion-web.git" }
    ]
  },
  3: {
    week: 3,
    title: "Sesión 3: Programación Orientada a Objetos (POO) del Lado del Servidor",
    subtitle: "Modelado de clases, instanciación de objetos, aplicación práctica de encapsulamiento, herencia y polimorfismo para construir lógica de negocio escalable.",
    date: "20 de abril - 24 de abril",
    sections: [
      {
        title: "1. El Paradigma Orientado a Objetos (POO)",
        text: "La Programación Orientada a Objetos permite estructurar sistemas de software modelando entidades del mundo real en componentes lógicos autónomos y reutilizables. La 'Clase' funciona como el plano estructurado que define los atributos (estado) y métodos (comportamiento) que tendrán los 'Objetos' instanciados en memoria a través de la directiva 'new'."
      },
      {
        title: "2. Encapsulamiento y Visibilidad",
        text: "El encapsulamiento restringe el acceso directo a los datos internos de un objeto para proteger su integridad. Los niveles de acceso se determinan con modificadores de visibilidad:\n- public: Acceso libre desde cualquier punto de la aplicación.\n- protected: Acceso limitado únicamente a la clase contenedora y clases derivadas por herencia.\n- private: Acceso exclusivo para la clase que los define.\nLas propiedades privadas se exponen de forma controlada mediante métodos de acceso públicos (Getters y Setters)."
      },
      {
        title: "3. Herencia y Reutilización de Código",
        text: "La herencia permite crear nuevas clases (subclases) a partir de clases base existentes (superclases). La subclase hereda todas las propiedades y métodos protegidos y públicos de su ancestro, pudiendo sobrescribir (overriding) comportamientos específicos o agregar nuevos miembros lógicos."
      },
      {
        title: "4. Polimorfismo e Interfaces",
        text: "El polimorfismo permite que objetos de diferentes clases respondan al mismo mensaje de formas distintas. Se implementa definiendo Interfaces o Clases Abstractas que establecen contratos obligatorios de métodos sin definir su implementación concreta. Esto desacopla las dependencias en la arquitectura de software.",
        code: `<?php
interface Notificable {
    public function enviarNotificacion(string $mensaje): bool;
}

class CorreoService implements Notificable {
    public function enviarNotificacion(string $mensaje): bool {
        // Simulación de envío de correo electrónico
        return true;
    }
}

class SMSService implements Notificable {
    public function enviarNotificacion(string $mensaje): bool {
        // Simulación de envío de mensaje de texto
        return true;
    }
}

// Uso práctico de Polimorfismo mediante inyección del contrato
function enviarAlerta(Notificable $notificador, string $mensaje) {
    $notificador->enviarNotificacion($mensaje);
}`
      }
    ],
    projects: [
      { name: "Desarrollo web - Ejercicio de Clases y Objetos POO", href: "https://github.com/vasco140123/React-Hooks-semana-7-GRUPAL.git" }
    ]
  },
  4: {
    week: 4,
    title: "Sesión 4: Persistencia de Datos: Conectividad y Consultas Relacionales SQL",
    subtitle: "Modelado físico de bases de datos relacionales, establecimiento de conexiones seguras mediante PDO (PHP Data Objects), sanitización de consultas y prevención de ataques SQL Injection.",
    date: "27 de abril - 01 de mayo",
    sections: [
      {
        title: "1. Bases de Datos Relacionales y SQL",
        text: "La persistencia de información requiere modelar tablas relacionales optimizadas, llaves primarias (PK), foráneas (FK) y reglas de integridad referencial. El motor MySQL de MariaDB es gestionado visualmente con PHPMyAdmin, facilitando el diseño lógico."
      },
      {
        title: "2. Conectividad Segura mediante PDO (PHP Data Objects)",
        text: "PDO es una capa de abstracción de acceso a datos que proporciona una API consistente independientemente del motor de base de datos utilizado (MySQL, PostgreSQL, SQL Server). Permite configurar el manejo de errores mediante excepciones de tipo PDOException, garantizando transiciones seguras."
      },
      {
        title: "3. Sentencias Preparadas y Prevención de SQL Injection",
        text: "La inyección SQL ocurre cuando datos dinámicos suministrados por el usuario se concatenan directamente en la consulta, permitiendo alterar la semántica de la consulta SQL. PDO resuelve esto mediante Sentencias Preparadas (Prepared Statements). Los parámetros se envían por separado al motor, asegurando su tratamiento estricto como datos y no como comandos.",
        code: `<?php
try {
    $dsn = "mysql:host=localhost;dbname=sistema_db;charset=utf8mb4";
    $pdo = new PDO($dsn, "dbuser", "dbpassword", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Prevención de SQL Injection mediante parámetros nombrados
    $sql = "SELECT id, nombre, email FROM usuarios WHERE email = :email AND estado = :estado";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'email' => $_POST['email'],
        'estado' => 'activo'
    ]);
    
    $usuario = $stmt->fetch();
} catch (PDOException $e) {
    error_log("Error de BD: " . $e->getMessage());
}`
      },
      {
        title: "4. Control de Transacciones (ACID)",
        text: "Para asegurar la atomicidad de múltiples operaciones de base de datos concurrentes, PDO implementa transacciones mediante 'beginTransaction()', 'commit()' y 'rollBack()'. Esto garantiza que si una de las operaciones falla, todos los cambios parciales se deshagan automáticamente."
      }
    ],
    projects: [
      { name: "Proyecto - Conexión de Datos y Reconciliación UNCP", href: "https://github.com/vasco140123/UNIFICACION-DE-DATOS-PRESUPUESTALES.git" }
    ]
  },
  5: {
    week: 5,
    title: "Sesión 5: Patrón Arquitectónico de Diseño MVC (Modelo-Vista-Controlador)",
    subtitle: "Separación estricta de responsabilidades web: desacoplamiento de la interfaz de usuario de la persistencia de datos mediante el enrutamiento de peticiones a controladores lógicos centrales.",
    date: "04 de mayo - 08 de mayo",
    sections: [
      {
        title: "1. Principio de Separación de Responsabilidades",
        text: "El patrón de diseño arquitectónico MVC divide la aplicación en tres componentes principales:\n- Modelo: Gestiona la lógica de negocios y la persistencia de los datos.\n- Vista: Renderiza la interfaz de usuario con la que interactúa el cliente final.\n- Controlador: Intercepta las solicitudes del usuario, coordina al Modelo para obtener datos y selecciona la Vista correcta para renderizarlos."
      },
      {
        title: "2. El Front Controller y Reescritura de URLs",
        text: "En lugar de tener múltiples scripts PHP expuestos directamente (ej. contacto.php, perfil.php), el patrón Front Controller redirige todas las peticiones a un único punto de entrada común ('index.php'). Esto se logra habilitando el motor de reescritura de Apache ('mod_rewrite') a través de un archivo de configuración '.htaccess'."
      },
      {
        title: "3. Sistema de Enrutamiento y Despacho",
        text: "El Front Controller recibe la URL solicitada, la analiza mediante un componente Enrutador (Router), extrae los parámetros dinámicos, instancia el controlador correspondiente y ejecuta el método (acción) asignado. Este flujo estandarizado centraliza tareas comunes como autenticación, sanitización y manejo de excepciones.",
        code: `<?php
// Enrutador básico conceptual para patrón MVC
class Router {
    protected array $routes = [];

    public function registrar(string $ruta, callable $callback) {
        $this->routes[$ruta] = $callback;
    }

    public function despachar(string $uri) {
        $urlPath = parse_url($uri, PHP_URL_PATH);
        if (array_key_exists($urlPath, $this->routes)) {
            return call_user_func($this->routes[$urlPath]);
        }
        http_response_code(404);
        echo "404 - Ruta no encontrada";
    }
}`
      }
    ],
    projects: [
      { name: "Propuesta de Arquitectura MVC en Portafolio", href: "https://github.com/vasco140123/decorfinanzas.git" }
    ]
  },
  6: {
    week: 6,
    title: "Sesión 6: Manejo de Dependencias Backend con Composer y APIs RESTful Básicas",
    subtitle: "Gestión e instalación de librerías externas del ecosistema Packagist, estructuración de peticiones HTTP semánticas (GET, POST) y serialización de respuestas nativas en formato JSON.",
    date: "11 de mayo - 15 de mayo",
    sections: [
      {
        title: "1. Composer y el Gestor de Dependencias",
        text: "Composer es la herramienta estándar para la gestión de dependencias en el ecosistema de PHP. Registra los paquetes externos requeridos en el archivo 'composer.json' y genera un árbol de resolución exacto en 'composer.lock'. Además, automatiza la carga de clases mediante el cargador automático compatible con la directiva PSR-4 ('vendor/autoload.php')."
      },
      {
        title: "2. Arquitectura de Servicios Web RESTful",
        text: "Una API RESTful utiliza los verbos del protocolo HTTP de forma semántica para realizar operaciones sobre recursos:\n- GET: Recuperar información de un recurso.\n- POST: Crear un nuevo recurso.\n- PUT / PATCH: Actualizar de forma total o parcial un recurso.\n- DELETE: Eliminar un recurso del servidor."
      },
      {
        title: "3. Serialización de Datos y Respuestas JSON",
        text: "Para que la API sea consumida por múltiples clientes (frontend, apps móviles, scripts externos), la respuesta del backend se serializa en formato JSON. Se debe configurar explícitamente el encabezado HTTP 'Content-Type: application/json; charset=utf-8' y utilizar la función nativa 'json_encode()' de PHP.",
        code: `<?php
// Configuración de cabeceras HTTP de respuesta
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$response = [
    "success" => true,
    "timestamp" => time(),
    "data" => [
        ["id" => 1, "nombre" => "Vasco Qori", "rol" => "Estudiante"],
        ["id" => 2, "nombre" => "Asesor UNCP", "rol" => "Docente"]
    ]
];

// Serialización nativa optimizada
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);`
      }
    ],
    projects: [
      { name: "Backend - Aplicación Web integrando APIs con Composer", href: "https://github.com/vasco140123/semana-6-aplicacion-web.git" }
    ]
  },
  7: {
    week: 7,
    title: "Sesión 7: Fundamentos, Ruteo e Introducción Práctica al Framework Laravel",
    subtitle: "Estructura de directorios global, configuración del motor de plantillas Blade, sistema de ruteo web semántico e implementación del mapeador relacional Eloquent ORM.",
    date: "18 de mayo - 22 de mayo",
    sections: [
      {
        title: "1. Introducción al Framework Laravel",
        text: "Laravel es un framework web MVC moderno de PHP. Proporciona herramientas avanzadas out-of-the-box, como inyección de dependencias, colas de trabajo, programador de tareas y un robusto ecosistema de autenticación."
      },
      {
        title: "2. Estructura de Directorios Global",
        text: "Laravel sigue una arquitectura de carpetas predefinida:\n- app/: Lógica principal, controladores y modelos.\n- routes/: Archivos de rutas ('web.php' para web y 'api.php' para servicios REST).\n- resources/views/: Plantillas Blade del frontend.\n- database/: Migraciones y sembradores (seeds) para estructuración de bases de datos."
      },
      {
        title: "3. Motor de Plantillas Blade",
        text: "Blade es el motor de plantillas de Laravel que compila a código PHP plano optimizado. Permite la herencia de layouts ('@extends', '@yield', '@section'), la inclusión de componentes reutilizables ('@include') y estructuras condicionales limpias que facilitan la maquetación."
      },
      {
        title: "4. Eloquent ORM (Object-Relational Mapping)",
        text: "Eloquent es la implementación activa de Active Record en Laravel. Mapea cada tabla de la base de datos a un Modelo de PHP. Permite realizar consultas de base de datos complejas utilizando métodos orientados a objetos, abstrayendo por completo el código SQL directo.",
        code: `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Categoria extends Model {
    protected $table = 'categorias';
    protected $fillable = ['nombre', 'descripcion'];

    // Relación de uno a muchos (One to Many)
    public function productos(): HasMany {
        return $this->hasMany(Producto::class);
    }
}

// Ejemplo de uso en controlador de Laravel:
// $productosActivos = Categoria::find(1)->productos()->where('activo', true)->get();`
      }
    ],
    projects: [
      { name: "Clon de Tareas Grupal - Prototipo Laravel/Vite", href: "https://github.com/vasco140123/React-Hooks-semana-7-GRUPAL.git" }
    ]
  },
  8: {
    week: 8,
    title: "Sesión 8: Evaluación Parcial y Consolidado de Notas",
    subtitle: "Evaluación práctica individual sobre desarrollo backend con PHP, MVC, conectividad PDO con bases de datos MySQL y estructuración de proyectos escalables.",
    date: "25 de mayo - 29 de mayo",
    sections: [
      {
        title: "1. Formato y Estructura de la Evaluación",
        text: "La evaluación de logro 1 consiste en una prueba práctica e individual donde se desarrolla un sistema web básico completo desde cero. Se debe implementar la conexión a una base de datos relacional MySQL, estructurar la lógica bajo el patrón arquitectónico MVC, sanitizar las entradas del usuario y exponer las vistas utilizando maquetación responsiva.",
        code: `// Estructura de archivos del proyecto de evaluación:
// ├── config/
// │   └── db.php           (Conexión PDO Singleton)
// ├── controllers/
// │   └── UserController.php (Control de flujo y lógica de negocio)
// ├── models/
// │   └── User.php         (Consultas preparadas de persistencia)
// ├── views/
// │   ├── login.php        (Formulario de acceso)
// │   └── dashboard.php    (Panel de control)
// ├── .htaccess           (Reescritura de URLs para ruteador)
// └── index.php           (Front Controller principal)`
      },
      {
        title: "2. Criterios de Evaluación y Calificación",
        text: "Los principales criterios técnicos evaluados son:\n1. Seguridad: Prevención estricta de ataques XSS y de inyección SQL (uso de sentencias preparadas en PDO).\n2. Estructura: Separación limpia de código en clases PHP, controladores independientes y vistas puras.\n3. Modularidad: Autocarga de clases y uso opcional de Composer para dependencias.\n4. Usabilidad: Diseño responsivo adaptado a dispositivos móviles."
      },
      {
        title: "3. Consolidación y Siguientes Fases",
        text: "Tras la revisión de la evaluación de logro, se realiza una sesión de retroalimentación donde se abordan errores comunes (como el manejo inadecuado de errores PDO o fallas de ruteo) y se definen las bases de diseño para la transición al framework moderno Laravel en la segunda mitad del ciclo."
      }
    ],
    projects: [
      { name: "Repositorio Vasco Qori — Todos los proyectos del ciclo", href: "https://github.com/vasco140123" }
    ]
  }
};
