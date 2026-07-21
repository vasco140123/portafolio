# Semana 4: Persistencia de Datos: Conexión y Consultas Relacionales con SQL

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 27 de abril – 01 de mayo de 2026  
**Herramientas:** MySQL, PDO Client, PHPMyAdmin  

---

## 1. Bases de Datos Relacionales y SQL

Una **base de datos relacional** almacena la información estructurada mediante **tablas** (relaciones), en las cuales cada tabla hace referencia a una entidad propia del modelo de negocio. La vinculación entre tablas mediante llaves facilita el procesamiento rápido de consultas interrelacionadas y asegura la **integridad referencial** dentro del sistema.

### Conceptos Fundamentales

| Concepto | Descripción |
|---|---|
| **Tabla** | Estructura organizada en filas y columnas que almacena registros equivalentes |
| **Columna / Campo** | Atributo o propiedad de la entidad (ej. nombre, precio, fecha_creacion) |
| **Fila / Registro** | Ejemplar individual o instancia específica de una entidad |
| **Primary Key (PK)** | Clave primaria que identifica de forma unívoca a cada registro |
| **Foreign Key (FK)** | Clave foránea que referencia a la PK de otra tabla para formar la relación |
| **Índice** | Estructura de datos optimizada para agilizar las búsquedas en campos clave |

### Integridad Referencial

El principio de integridad referencial asegura la inexistencia de vínculos rotos en la base de datos. Por ejemplo, al vincular una orden de compra con el `cliente_id = 5`, es indispensable que dicho identificador exista en la tabla de `clientes`. En caso de borrar dicho cliente, la base de datos permite definir reglas de acción:

- **RESTRICT**: Bloquea la supresión del registro padre si cuenta con registros asociados.
- **CASCADE**: Elimina de manera automática los registros dependientes.
- **SET NULL**: Asigna el valor NULL a la clave foránea en los registros asociados.

### PHPMyAdmin como Herramienta Gráfica

**PHPMyAdmin** constituye un entorno web enfocado en la gestión de motores MySQL y MariaDB, integrado habitualmente en suites como XAMPP. Ofrece facilidades para la administración de esquemas, diseño de tablas, ejecución de sentencias SQL, exportación/importación de datos y la exploración visual de la base de datos sin recurrir a la consola de comandos.

Se ingresa mediante la URL: `http://localhost/phpmyadmin/`

---

## 2. Conectividad Segura mediante PDO (PHP Data Objects)

**PDO (PHP Data Objects)** funciona como una interfaz de abstracción para la interacción con bases de datos desde PHP. Brinda una **API uniforme** que permite interactuar con diversos motores relacionales (tales como MySQL, PostgreSQL, SQLite o SQL Server) empleando un patrón de código homogéneo.

### Ventajas de PDO sobre las extensiones antiguas

| Característica | `mysql_*` (desfasado) | `mysqli_*` | `PDO` |
|---|---|---|---|
| Soporte para múltiples motores |  Exclusivo para MySQL |  Limitado a MySQL/MariaDB |  Compatible con 12+ motores |
| Sentencias Preparadas (Prepared Statements) |  Inexistente |  Disponible |  Disponible |
| Parámetros Nominados (Named Parameters) |  Inexistente |  Inexistente |  Disponible |
| Gestión de Excepciones |  Inexistente |  Parcial |  Mediante PDOException |
| Orientación a Objetos |  Inexistente |  Parcial |  Total |

### Creando la Conexión con PDO

El vínculo con la base de datos se establece instanciando la clase `PDO` al suministrar un **DSN (Data Source Name)** junto con las credenciales correspondientes:

```php
<?php
// Parámetros de conexión (en entornos de producción, extraer de variables de entorno)
$host     = '127.0.0.1';
$puerto   = '3306';
$baseDato = 'portafolio_db';
$usuario  = 'root';
$password = ''; // En producción: establecer clave segura

try {
    // Definición del DSN (Data Source Name): especifica motor, host, puerto, BD y juego de caracteres
    $dsn = "mysql:host={$host};port={$puerto};dbname={$baseDato};charset=utf8mb4";

    // Opciones globales de configuración de PDO
    $opciones = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // Notificar errores mediante excepciones
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // Retornar resultados en arreglos asociativos
        PDO::ATTR_EMULATE_PREPARES   => false,                   // Forzar el uso de preparaciones nativas del motor
    ];

    $pdo = new PDO($dsn, $usuario, $password, $opciones);

    echo " Enlace a la base de datos realizado satisfactoriamente.";

} catch (PDOException $e) {
    // Evitar la exposición de detalles de la excepción al usuario final en producción
    error_log("Fallo de conexión a la BD: " . $e->getMessage());
    die("Error interno del servidor. Por favor, reintente más tarde.");
}
```

---

## 3. Sentencias Preparadas y Prevención de SQL Injection

La **inyección SQL (SQL Injection)** representa un riesgo crítico de seguridad en los sistemas web. Se presenta al incrustar directamente valores proporcionados por el usuario dentro de las consultas SQL sin la debida depuración:

```php
<?php
// ️ CÓDIGO CON VULNERABILIDAD - NO UTILIZAR NUNCA
$nombre = $_GET['nombre']; // Entrada del usuario: ' OR '1'='1
$sql    = "SELECT * FROM usuarios WHERE nombre = '$nombre'";
// La instrucción evaluada resulta en:
// SELECT * FROM usuarios WHERE nombre = '' OR '1'='1'
// ¡Lo cual extrae la totalidad de filas en la tabla!
```

### Prepared Statements: La Solución Correcta

Las **consultas preparadas** separan estructuralmente el comando SQL de los valores parametrizados. El motor de datos compila previamente la sintaxis de la consulta y posteriormente asocia los parámetros recibidos, anulando la posibilidad de inyección SQL:

```php
<?php
declare(strict_types=1);

/**
 * Consulta información de estudiantes por nombre y especialidad mediante parámetros nombrados.
 * El uso de parámetros nombrados (:nombre, :carrera) neutraliza la Inyección SQL.
 */
function buscarEstudiantes(PDO $pdo, string $nombre, string $carrera): array {
    // 1. Definición de la consulta con marcadores de parámetros
    $sql = "SELECT 
                e.id,
                e.nombre_completo,
                e.codigo_universitario,
                c.nombre AS carrera,
                e.promedio_ponderado
            FROM estudiantes e
            INNER JOIN carreras c ON e.carrera_id = c.id
            WHERE e.nombre_completo LIKE :nombre
              AND c.nombre = :carrera
            ORDER BY e.promedio_ponderado DESC
            LIMIT 50";

    $stmt = $pdo->prepare($sql);

    // 2. Asociación de valores a los marcadores (los datos transitan de forma independiente)
    $stmt->bindValue(':nombre',  "%{$nombre}%", PDO::PARAM_STR);
    $stmt->bindValue(':carrera', $carrera,       PDO::PARAM_STR);

    // 3. Ejecución de la sentencia previa
    $stmt->execute();

    // 4. Extracción de los registros en forma de arreglo asociativo
    return $stmt->fetchAll(); // Aplica FETCH_ASSOC según la configuración del PDO
}

// Ejemplo de ejecución
try {
    $estudiantes = buscarEstudiantes($pdo, "Ramos", "Ingeniería de Sistemas");

    foreach ($estudiantes as $estudiante) {
        echo " {$estudiante['nombre_completo']} | "
           . "Código: {$estudiante['codigo_universitario']} | "
           . "Promedio: {$estudiante['promedio_ponderado']}<br>";
    }

    if (empty($estudiantes)) {
        echo "No se ubicaron estudiantes con los parámetros indicados.";
    }

} catch (PDOException $e) {
    error_log($e->getMessage());
    echo "Ocurrió un inconveniente al consultar la base de datos.";
}
```

---

## 4. Control de Transacciones ACID

Una **transacción** abarca un conjunto de operaciones en la base de datos que deben procesarse de modo atómico: o bien se aprueban todas exitosamente, o bien ninguna surte efecto. Las transacciones respaldan los principios **ACID**:

| Propiedad | Significado |
|---|---|
| **A — Atomicidad** | La transacción opera bajo el principio de todo o nada |
| **C — Consistencia** | Garantiza la transición de la BD entre estados válidos |
| **I — Aislamiento** | Previene que ejecuciones concurrentes interfieran entre sí |
| **D — Durabilidad** | Los cambios ratificados permanecen vigentes aun ante fallos de energía o sistema |

### Implementación en PDO

```php
<?php
function transferirFondos(
    PDO    $pdo,
    int    $cuentaOrigenId,
    int    $cuentaDestinoId,
    float  $monto
): void {
    try {
        $pdo->beginTransaction(); // Arrancar la transacción

        // Operación 1: Descontar de la cuenta emisora
        $stmtDebito = $pdo->prepare(
            "UPDATE cuentas SET saldo = saldo - :monto WHERE id = :id AND saldo >= :monto"
        );
        $stmtDebito->execute([':monto' => $monto, ':id' => $cuentaOrigenId]);

        if ($stmtDebito->rowCount() === 0) {
            throw new \RuntimeException("La cuenta de origen no dispone de saldo suficiente.");
        }

        // Operación 2: Incrementar saldo en la cuenta receptora
        $stmtCredito = $pdo->prepare(
            "UPDATE cuentas SET saldo = saldo + :monto WHERE id = :id"
        );
        $stmtCredito->execute([':monto' => $monto, ':id' => $cuentaDestinoId]);

        // Operación 3: Grabar la transacción en la bitácora de movimientos
        $stmtHistorial = $pdo->prepare(
            "INSERT INTO movimientos (cuenta_origen_id, cuenta_destino_id, monto, fecha)
             VALUES (:origen, :destino, :monto, NOW())"
        );
        $stmtHistorial->execute([
            ':origen'  => $cuentaOrigenId,
            ':destino' => $cuentaDestinoId,
            ':monto'   => $monto
        ]);

        $pdo->commit(); // Confirmar y consolidar las operaciones realizadas
        echo " Transferencia por el monto de S/ {$monto} efectuada con éxito.";

    } catch (\Exception $e) {
        $pdo->rollBack(); // Deshacer todas las modificaciones si ocurre un error
        error_log("Inconveniente en transferencia: " . $e->getMessage());
        throw $e; // Propagar la excepción para su gestión superior
    }
}
```

---

## 5. ¿Qué se aprendió?

Durante esta unidad se alcanzaron aprendizajes clave para la gestión del almacenamiento backend:

- **Modelado de datos relacionales:** Comprensión de las bases para estructurar tablas vinculadas mediante llaves primarias y secundarias, junto a la aplicación de reglas de normalización que previenen la duplicidad de datos.

- **Uso estandarizado de PDO:** Adopción de PDO como interfaz predilecta para la integración entre PHP y motores relacionales, sustituyendo bibliotecas obsoletas y valorando la portabilidad del código.

- **Mitigación del riesgo de SQL Injection:** Concientización sobre las vulnerabilidades asociadas a la interpolación directa de datos e internalización de las sentencias preparadas como la barrera de defensa efectiva.

- **Procesamiento de operaciones mediante transacciones:** Entendimiento del uso de bloques transaccionales en procesos con múltiples modificaciones dependientes (ejemplo: movimientos financieros) para preservar la coherencia de los datos.

---

## 6. ¿Cómo se aplicó?

Las actividades aplicadas durante el período incluyeron:

1. **Construcción del modelo relacional:** Creación de la base de datos `portafolio_db` incorporando las entidades `categorias`, `productos`, `clientes` y `pedidos`, especificando sus restricciones clave e integridad.

2. **Implementación de operaciones CRUD con PDO:** Desarrollo de las funcionalidades básicas de creación, lectura, actualización y borrado para el recurso `Producto`, empleando parametrización segura en cada comando de escritura.

3. **Módulo de filtrado avanzado:** Elaboración de un buscador de artículos capaz de filtrar por atributos múltiples (nombre, categoría, bandas de precio), armando estructuras SQL dinámicas de forma protegida.

4. **Práctica de transacciones:** Creación de un flujo de ventas que en una única transacción generaba el pedido, ajustaba el inventario del producto y registraba el evento, comprobando el correcto rollback ante fallos controlados.
