# Semana 3: Programación Orientada a Objetos (POO) del Lado del Servidor

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 20 de abril – 24 de abril de 2026  
**Herramientas:** Paradigma POO, Clases Abstractas, PHP 8.x  

---

## 1. El Paradigma Orientado a Objetos

La **Programación Orientada a Objetos (POO)** es un enfoque de diseño de software centrado en la creación y manipulación de **objetos**, sustituyendo la estructuración puramente procedimental basada en funciones sueltas. Un objeto representa una unidad funcional que agrupa un **estado** (propiedades o atributos de datos) y un **comportamiento** (métodos o acciones ejecutables).

### La Clase como Plano Arquitectónico

Una **clase** actúa como el diseño estructural o modelo conceptual (*blueprint*) a partir del cual se definen las características y operaciones de un grupo de objetos. De manera análoga a los planos de una edificación: la plantilla establece minuciosamente las especificaciones de construcción sin ser el edificio en sí. En PHP, una clase se declara empleando la palabra reservada `class`:

```php
<?php
class Producto {
    // Atributos (propiedades)
    public string $nombre;
    public float  $precio;
    public int    $stock;

    // Constructor: método especial que se llama al crear un objeto
    public function __construct(string $nombre, float $precio, int $stock) {
        $this->nombre = $nombre;
        $this->precio = $precio;
        $this->stock  = $stock;
    }

    // Método de comportamiento
    public function estaDisponible(): bool {
        return $this->stock > 0;
    }
}
```

### El Objeto como Instancia

Un **objeto** constituye la materialización concreta derivada de una clase. Su instanciación se lleva a cabo mediante la instrucción `new`:

```php
<?php
// Crear instancias (objetos) a partir de la clase Producto
$laptop  = new Producto("Laptop Lenovo", 2499.99, 10);
$monitor = new Producto("Monitor LG 27\"", 899.50, 0);

// Acceder a propiedades y llamar métodos con ->
echo $laptop->nombre;               // "Laptop Lenovo"
echo $monitor->estaDisponible() ? "Disponible" : "Agotado"; // "Agotado"
```

### El Operador `$this`

Dentro del contexto de los métodos de una clase, la variable especial `$this` sirve como puntero hacia la instancia actual que ejecuta la instrucción. Esto posibilita que el objeto referencie y manipule sus propios atributos y métodos internos.

---

## 2. Encapsulamiento y Visibilidad

El **encapsulamiento** consiste en la técnica de resguardar el estado interno y la lógica de implementación de una clase, habilitando únicamente los puntos de acceso necesarios para la interacción externa. En PHP, esta protección se regula mediante calificadores de visibilidad:

| Modificador | Accesible desde... |
|---|---|
| `public` | Cualquier ámbito: la propia clase, clases heredadas y scripts externos |
| `protected` | Exclusivamente en la clase de origen y en sus clases derivadas (subclases) |
| `private` | Únicamente dentro de la clase específica donde se definió |

### Getters y Setters

En presencia de miembros con alcance `private` o `protected`, la lectura y modificación externa se canaliza a través de métodos expuestos denominados **getters** (consultores) y **setters** (modificadores):

```php
<?php
class CuentaBancaria {
    private float $saldo;
    private string $titular;

    public function __construct(string $titular, float $saldoInicial = 0.0) {
        $this->titular = $titular;
        $this->saldo   = $saldoInicial;
    }

    // Getter: expone la propiedad en modo lectura
    public function getSaldo(): float {
        return $this->saldo;
    }

    public function getTitular(): string {
        return $this->titular;
    }

    // Setter con validación de negocio integrada
    public function depositar(float $monto): void {
        if ($monto <= 0) {
            throw new \InvalidArgumentException("El monto a depositar debe ser positivo.");
        }
        $this->saldo += $monto;
    }

    public function retirar(float $monto): void {
        if ($monto > $this->saldo) {
            throw new \RuntimeException("Saldo insuficiente para realizar el retiro.");
        }
        $this->saldo -= $monto;
    }
}
```

La gran ventaja del encapsulamiento radica en que las restricciones y validaciones del negocio (por ejemplo, impidiendo retiros superiores al saldo existente) permanecen centralizadas dentro del objeto en vez de estar dispersas en el sistema.

---

## 3. Herencia y Reutilización de Código

La **herencia** posibilita que una nueva clase (subclase o clase derivada) adopte de forma automática los atributos y métodos de una clase ya establecida (superclase o clase base). Esta característica fomenta la **reutilización de componentes** y la adherencia al principio *DRY (Don't Repeat Yourself)*.

```php
<?php
// Superclase (clase padre)
class Persona {
    protected string $nombre;
    protected string $dni;

    public function __construct(string $nombre, string $dni) {
        $this->nombre = $nombre;
        $this->dni    = $dni;
    }

    public function presentarse(): string {
        return "Hola, soy {$this->nombre} con DNI {$this->dni}.";
    }
}

// Subclase (clase hija) — hereda de Persona
class Estudiante extends Persona {
    private string $codigoUniversitario;
    private float  $promedioPonderado;

    public function __construct(
        string $nombre,
        string $dni,
        string $codigoUniversitario
    ) {
        // Llamar al constructor del padre
        parent::__construct($nombre, $dni);
        $this->codigoUniversitario = $codigoUniversitario;
        $this->promedioPonderado   = 0.0;
    }

    // Override (sobreescritura) del método padre
    public function presentarse(): string {
        $base = parent::presentarse(); // Reutiliza el método del padre
        return $base . " Soy estudiante con código {$this->codigoUniversitario}.";
    }

    public function getPromedioPromedioPonderado(): float {
        return $this->promedioPonderado;
    }
}

$estudiante = new Estudiante("Vasco Ramos", "75430218", "2023-1045");
echo $estudiante->presentarse();
// Salida: Hola, soy Vasco Ramos con DNI 75430218. Soy estudiante con código 2023-1045.
```

---

## 4. Polimorfismo e Interfaces

El **polimorfismo** (del griego: "diversas formas") representa la cualidad de manipular entidades de distintas clases mediante una interfaz unificada. Constituye uno de los principios fundamentales en el diseño orientado a objetos.

### Interfaces: Contratos Obligatorios

Una **interfaz** estipula un compromiso formal: una colección de declaraciones de métodos que toda clase que decida implementarla **está comprometida** a definir. Las interfaces omiten la lógica interna y especifican únicamente las firmas de los métodos:

```php
<?php
// Interfaz que actúa como contrato
interface Notificable {
    public function enviar(string $destinatario, string $mensaje): bool;
    public function obtenerNombreCanal(): string;
}

// Implementación 1: Correo Electrónico
class CorreoService implements Notificable {
    private string $servidorSMTP;

    public function __construct(string $servidorSMTP = 'smtp.gmail.com') {
        $this->servidorSMTP = $servidorSMTP;
    }

    public function enviar(string $destinatario, string $mensaje): bool {
        // Lógica real de envío de email (simulada aquí)
        echo " Enviando correo a {$destinatario} vía {$this->servidorSMTP}...<br>";
        echo "   Mensaje: {$mensaje}<br>";
        return true; // true si el envío fue exitoso
    }

    public function obtenerNombreCanal(): string {
        return 'Correo Electrónico';
    }
}

// Implementación 2: SMS
class SMSService implements Notificable {
    private string $proveedorApi;

    public function __construct(string $proveedorApi = 'Twilio') {
        $this->proveedorApi = $proveedorApi;
    }

    public function enviar(string $destinatario, string $mensaje): bool {
        // Lógica de envío de SMS vía API (simulada)
        echo " Enviando SMS a {$destinatario} vía {$this->proveedorApi}...<br>";
        echo "   Mensaje: {$mensaje}<br>";
        return true;
    }

    public function obtenerNombreCanal(): string {
        return 'SMS';
    }
}

// Implementación 3: WhatsApp
class WhatsAppService implements Notificable {
    public function enviar(string $destinatario, string $mensaje): bool {
        echo " Enviando WhatsApp a {$destinatario}...<br>";
        echo "   Mensaje: {$mensaje}<br>";
        return true;
    }

    public function obtenerNombreCanal(): string {
        return 'WhatsApp';
    }
}

// Función polimórfica: trabaja con cualquier Notificable
function notificarUsuario(Notificable $servicio, string $usuario, string $mensaje): void {
    echo "<strong>Canal: " . $servicio->obtenerNombreCanal() . "</strong><br>";
    $resultado = $servicio->enviar($usuario, $mensaje);
    echo $resultado ? " Notificación enviada exitosamente.<br>" : " Error al enviar.<br>";
    echo "<hr>";
}

// Uso polimórfico
$servicios = [
    new CorreoService(),
    new SMSService(),
    new WhatsAppService()
];

foreach ($servicios as $servicio) {
    notificarUsuario($servicio, "vasco@uncp.edu.pe", "Tu matrícula fue confirmada.");
}
```

### ¿Por qué el Desacoplamiento importa?

En la ilustración previa, la función `notificarUsuario()` prescinde de conocer los detalles específicos sobre **de qué forma** cada canal realiza la emisión de la notificación. Únicamente requiere garantizar que cualquier objeto suministrado respete la interfaz `Notificable`. Gracias a ello, en el futuro se podrá incorporar un conector como `PushNotificationService` sin necesidad de modificar el código existente que realiza el llamado.

---

## 5. ¿Qué se aprendió?

Esta unidad marcó una evolución trascendental en la forma de conceptualizar la construcción de aplicaciones:

- **La POO como modelo mental de arquitectura:** Se comprendió que la programación orientada a objetos excede la simple definición de clases, constituyendo un modelo para abstraer el dominio del problema (Producto, Estudiante, CuentaBancaria) en responsabilidades bien acotadas.

- **Encapsulamiento como salvaguarda de datos:** Se comprendió que establecer variables `private` e intermediar su acceso mediante getters y setters no es una formalidad innecesaria, sino la vía para preservar la validez de los datos y normar las operaciones del negocio.

- **Herencia bajo un criterio responsable:** Se comprendió que la herencia es valiosa cuando responde a una relación genuina del tipo *"es un"* (un Estudiante **es una** Persona), evitando emplearla simplemente como un mecanismo para compartir código.

- **Orientación a interfaces frente a clases concretas:** Diseñar teniendo como base las interfaces en lugar de implementaciones fijas representa el cimiento para crear arquitecturas flexibles y testeables. Esta cualidad se experimentó en la práctica mediante el desarrollo del sistema multicanal de notificaciones.

---

## 6. ¿Cómo se aplicó?

La ejercitación técnica durante esta semana integró los siguientes componentes:

1. **Sistema de inventario con POO:** Se estructuraron las clases `Producto`, `Categoría` e `Inventario`, protegiendo el estado con visibilidad privada y controlando el acceso mediante métodos especificos.

2. **Jerarquía de personas:** Se definió la estructura de clases `Persona → Empleado → EmpleadoDocente`, aplicando la herencia de propiedades, la invocación de `parent::__construct()` y la sobreescritura de comportamiento.

3. **Sistema de notificaciones polimórfico:** Se construyó la interfaz `Notificable` junto con tres implementaciones independientes (email, SMS y WhatsApp), comprobando la extensibilidad de la función cliente sin requerir modificaciones.

4. **Clases abstractas:** Se estudió el uso de `abstract class` para definir estructuras con comportamiento compartido e incompleto que deben completar las subclases, diferenciando la clase abstracta (que permite código parcial) de la interfaz (que prescribe solo contratos).
