# Semana 2: Estructuras de Control, Tipos de Datos Avanzados y Funciones Nativas

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 13 de abril – 17 de abril de 2026  
**Herramientas:** PHP Vanilla, Algoritmia Backend  

---

## 1. Sistema de Tipos de Datos en PHP Vanilla

El lenguaje PHP destaca por utilizar un sistema de **tipado dinámico**, en el cual el tipo atribuido a una variable es inferido automáticamente por el motor de ejecución según el valor asignado. Aunque esta cualidad brinda gran flexibilidad al iniciar el aprendizaje, también puede ser causa de anomalías imprevistas en proyectos de mayor envergadura.

### Tipado Dinámico vs. Tipado Estricto

Bajo la modalidad dinámica por defecto, PHP efectúa **conversiones implícitas de tipo** (type juggling) de forma automática:

```php
<?php
$valor = "10" + 5; // PHP convierte "10" a entero → resultado: 15 (integer)
$suma  = true + true; // true = 1, resultado: 2
```

A partir del lanzamiento de PHP 7.0, se incorporó la instrucción `declare(strict_types=1)` la cual, posicionada al comienzo del script, demanda al motor PHP una validación rigurosa de los tipos declarados en la invocación de funciones. Esto permite alternar hacia un modelo de **tipado fuerte** dentro del alcance de dicho archivo:

```php
<?php
declare(strict_types=1); // Debe ser la primera instrucción del archivo
```

### Tipos Escalares

Corresponden a los tipos de datos atómicos o primitivos soportados en PHP:

| Tipo | Descripción | Ejemplo |
|---|---|---|
| `int` | Valores numéricos enteros | `$edad = 20;` |
| `float` | Números con parte decimal (coma flotante) | `$precio = 49.99;` |
| `string` | Cadenas de caracteres de texto | `$nombre = "Vasco";` |
| `bool` | Estado de valor lógico (verdadero o falso) | `$activo = true;` |

### Tipos Compuestos

Los tipos compuestos posibilitan la agrupación de múltiples elementos:

- **`array`**: Estructura de colección ordenada, la cual puede indexarse de forma numérica o mediante asociación de clave-valor.
- **`object`**: Instancia creada a partir de una clase estructurada por el programador.

### Tipos Especiales

- **`null`**: Denota la ausencia deliberada de valor.
- **`callable`**: Puntero o referencia hacia una función o método invocable.
- **`resource`**: Identificador asignado a un recurso externo (tales como conexiones BD o manejadores de archivos).

---

## 2. Estructuras de Decisión Lógica

Las sentencias condicionales permiten alterar el flujo de ejecución del programa de acuerdo con la evaluación de expresiones lógicas durante el tiempo de ejecución.

### if / else if / else

Es la estructura básica para la ramificación de código. En esta evaluación cobra relevancia el empleo del operador de igualdad estricta `===` frente a la comparación convencional `==`:

| Operador | Tipo | Ejemplo |
|---|---|---|
| `==` | Comparación débil (evalúa contenido, ignora el tipo) | `"1" == 1` → `true` |
| `===` | Comparación estricta (evalúa contenido Y tipo) | `"1" === 1` → `false` |
| `!=` / `!==` | Desigualdad débil / estricta | |
| `<=>` | Operador de comparación tripartita (spaceship) | Retorna -1, 0 o 1 |

### switch y la nueva Match Expression de PHP 8.x

La estructura `switch` facilita la evaluación de una misma variable frente a múltiples opciones. Sin embargo, su limitación estriba en que efectúa comparaciones de tipo débil `==`. Desde la versión 8.0 de PHP se cuenta con la **expresión match**, una alternativa moderna que opera bajo comparación estricta, devuelve un valor directamente y no requiere sentencias `break`:

```php
<?php
$estado = "aprobado";

// Forma clásica con switch (comparación débil)
switch ($estado) {
    case 'aprobado':
        $mensaje = "El pago fue procesado exitosamente.";
        break;
    case 'pendiente':
        $mensaje = "El pago está en proceso de verificación.";
        break;
    case 'rechazado':
        $mensaje = "El pago fue rechazado. Intente con otro método.";
        break;
    default:
        $mensaje = "Estado desconocido.";
}

// Forma moderna con match (PHP 8.x - comparación ESTRICTA ===)
$mensaje = match($estado) {
    'aprobado'  => "El pago fue procesado exitosamente.",
    'pendiente' => "El pago está en proceso de verificación.",
    'rechazado' => "El pago fue rechazado. Intente con otro método.",
    default     => "Estado desconocido."
};
```

**Ventajas de `match` sobre `switch`:**
- Implementa comparación de tipo estricto `===` (previene incoherencias por coerción).
- Funciona como una expresión que devuelve directamente un valor.
- Elimina la necesidad de utilizar sentencias `break`.
- Proporciona una sintaxis más limpia y expresiva.
- Desencadena una excepción `UnhandledMatchError` cuando ningún patrón coincide y se omite la cláusula `default`.

---

## 3. Bucles Iterativos y su Optimización

Las estructuras repetitivas permiten ejecutar de forma reiterada un bloque de instrucciones basándose en el cumplimiento de una condición.

### Bucle `for`

Recomendado cuando se conoce previamente la cantidad exacta de repeticiones a efectuar:

```php
<?php
// Tabla de multiplicar del 7
for ($i = 1; $i <= 10; $i++) {
    echo "7 × {$i} = " . (7 * $i) . "<br>";
}
```

### Bucle `while`

Indicado en aquellos escenarios donde el fin de las iteraciones depende de una condición dinámica y se desconoce cuántas repeticiones se efectuarán:

```php
<?php
$intentos = 0;
$limite   = 5;

while ($intentos < $limite) {
    echo "Intento número: {$intentos}<br>";
    $intentos++;
}
```

### Bucle `foreach` sobre Arreglos Asociativos

El bucle `foreach` representa la convención más adecuada en PHP para el recorrido de arreglos, especialmente aquellos configurados con estructura asociativa:

```php
<?php
$producto = [
    'nombre'   => 'Laptop Lenovo IdeaPad',
    'precio'   => 2499.99,
    'stock'    => 15,
    'categoria' => 'Electrónica'
];

foreach ($producto as $clave => $valor) {
    echo "<strong>{$clave}:</strong> {$valor}<br>";
}
```

---

## 4. Modularización mediante Funciones Reutilizables

Las funciones corresponden a bloques delimitados de código identificados bajo un nombre, concebidos para solventar una labor concreta de forma repetible. En las buenas prácticas con PHP moderno, se aconseja explicitar los tipos de parámetros y de retorno, favoreciendo la autodocumentación y la detección temprana de discrepancias de tipos.

### Tipado Estricto en Parámetros y Retorno

```php
<?php
declare(strict_types=1);

/**
 * Calcula el importe total de una venta aplicando descuentos por tipo de cliente.
 *
 * @param float  $subtotal    Monto base sin descuentos ni impuestos.
 * @param string $tipoCliente Categoría del cliente: 'regular', 'frecuente', 'vip', 'mayorista'.
 * @param bool   $aplicarIGV  Si se debe incluir el IGV (18%) al total.
 * @return float              Importe final a cobrar.
 */
function calcularImporteTotal(
    float  $subtotal,
    string $tipoCliente = 'regular',
    bool   $aplicarIGV  = true
): float {

    // Determinar el porcentaje de descuento usando match expression
    $descuentoPorcentaje = match($tipoCliente) {
        'vip'       => 0.20,  // 20% de descuento para clientes VIP
        'mayorista' => 0.15,  // 15% de descuento para mayoristas
        'frecuente' => 0.08,  // 8% de descuento para clientes frecuentes
        'regular'   => 0.00,  // Sin descuento para clientes regulares
        default     => throw new \InvalidArgumentException(
            "Tipo de cliente no reconocido: '{$tipoCliente}'"
        )
    };

    // Aplicar el descuento al subtotal
    $montoDescuento = $subtotal * $descuentoPorcentaje;
    $subtotalConDescuento = $subtotal - $montoDescuento;

    // Aplicar IGV (18%) si corresponde
    $igv   = $aplicarIGV ? $subtotalConDescuento * 0.18 : 0.0;
    $total = $subtotalConDescuento + $igv;

    return round($total, 2); // Redondear a 2 decimales
}

// --- Casos de prueba ---
$precio = 1000.00;

echo "Cliente Regular (con IGV): S/ " . calcularImporteTotal($precio, 'regular', true) . PHP_EOL;
// Salida: S/ 1180.00

echo "Cliente VIP (sin IGV):     S/ " . calcularImporteTotal($precio, 'vip', false) . PHP_EOL;
// Salida: S/ 800.00

echo "Cliente Mayorista (con IGV): S/ " . calcularImporteTotal($precio, 'mayorista', true) . PHP_EOL;
// Salida: S/ 1003.00
```

### Funciones de Cadena Nativas de PHP más Usadas

| Función | Descripción | Ejemplo |
|---|---|---|
| `strlen()` | Determina la longitud de una cadena | `strlen("Vasco")` → `5` |
| `strtolower()` | Transforma texto a minúsculas | `strtolower("PHP")` → `"php"` |
| `strtoupper()` | Transforma texto a mayúsculas | `strtoupper("php")` → `"PHP"` |
| `str_replace()` | Sustituye un fragmento de texto | `str_replace(" ", "_", "hola mundo")` → `"hola_mundo"` |
| `explode()` | Segmenta una cadena en un array mediante delimitador | `explode(",", "a,b,c")` → `["a","b","c"]` |
| `implode()` | Concatena elementos de un array en una cadena | `implode("-", ["a","b","c"])` → `"a-b-c"` |
| `trim()` | Suprime espacios en blanco en los extremos | `trim("  hola  ")` → `"hola"` |
| `substr()` | Extrae una porción de una cadena de texto | `substr("Vasco", 0, 3)` → `"Vas"` |

---

## 5. ¿Qué se aprendió?

En el transcurso de esta semana se transitó de la configuración básica a la **lógica fundamental de desarrollo en PHP**:

- **Comprensión del sistema de tipos en PHP:** Se identificó la clara diferencia entre el modelo dinámico y el modelo estricto, comprendiendo el beneficio de aplicar `declare(strict_types=1)` en desarrollos profesionales.

- **Operadores de comparación:** Se dominó la distinción entre `==` y `===`, asimilando cómo la igualdad estricta evita fallos lógicos sutiles en aplicaciones reales.

- **Estructuras de control modernas:** Se examinó la `expresión match` disponible en PHP 8.x como evolución sobre el `switch` convencional, valorando su aporte en seguridad de tipos y simplicidad.

- **Definición de funciones con tipado explícito:** Se practicó la construcción de funciones especificando tipos de entrada y retorno, favoreciendo el mantenimiento y la robustez del código.

- **Uso de arreglos asociativos:** Se comprendió el valor estratégico de los arrays clave-valor en PHP como estructuras idóneas para modelar datos del dominio del problema.

---

## 6. ¿Cómo se aplicó?

El trabajo práctico de la semana consistió en las siguientes soluciones:

1. **Calculadora de descuentos:** Se desarrolló la lógica de cálculo de costos para diferentes perfiles de cliente, integrando expresiones `match` y funciones con validación estricta de tipos.

2. **Procesador de formulario:** Se diseñó una interfaz en HTML para enviar datos por POST hacia un script PHP encargado de su validación, desinfección (`htmlspecialchars()`, `trim()`) y posterior renderizado.

3. **Generador de tablas HTML:** Mediante iteraciones con `for` y `foreach` sobre listas de estructuras asociativas, se construyó dinámicamente una tabla HTML detallando registros académicos (estudiante, calificación, estado final).

4. **Exploración de funciones nativas:** Se estudiaron y aplicaron funciones esenciales para la manipulación de cadenas y colecciones en PHP, incluyendo utilidades como `array_map()`, `array_filter()` y `array_reduce()`.
