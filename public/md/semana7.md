# Semana 7: Bases, Enrutamiento e Introducción Práctica al Framework Laravel

**Estudiante:** Vasco Qori Ramos Mercado
**Curso:** Desarrollo de Aplicaciones Web
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)
**Carrera:** Ingeniería de Sistemas
**Período:** 18 de mayo – 22 de mayo de 2026
**Herramientas:** Framework Laravel, Motor Blade, Eloquent ORM

---

## 1. Introducción al Framework Laravel

**Laravel** constituye el marco de trabajo en PHP con mayor relevancia y adopción en el panorama web moderno. Diseñado por Taylor Otwell y publicado en 2011, reformuló la programación en PHP ofreciendo una sintaxis expresiva, estructurada y enfocada en maximizar la eficiencia del programador.

### ¿Por qué elegir Laravel frente a PHP Vanilla?

Tras haber implementado un patrón MVC artesanal en las semanas previas, la adopción de Laravel supone una transición fluida: los primeros temas aportaron la **base conceptual** (la mecánica interna del backend), mientras que Laravel suministra una **solución industrial, validada y continuamente actualizada** para dichos conceptos.

| Característica | PHP Vanilla / MVC Artesanal | Laravel |
|---|---|---|
| Enrutador | Diseñado de forma manual | Integrado y de altas prestaciones |
| ORM | Consultas PDO escritas a mano | Eloquent ORM |
| Sistema de plantillas | Mezcla directa de HTML con PHP | Motor Blade |
| Autenticación | Creada desde cero | Ecosistemas Breeze/Jetstream |
| Migraciones de BD | Scripts de SQL ejecutados manualmente | Gestor de migraciones |
| Pruebas unitarias | Proceso manual | PHPUnit listo para usar |
| Gestor de colas | Sin soporte nativo | Laravel Queues incorporado |

### Instalación mediante Composer

```bash
# Inicializar una nueva aplicación con Laravel (última versión disponible)
composer create-project laravel/laravel mi-portafolio

# Desplegar el servidor de desarrollo local
cd mi-portafolio
php artisan serve
# La aplicación responderá en: http://127.0.0.1:8000
```

### Inyección de Dependencias

Laravel cuenta con un **Contenedor de Inversión de Control (IoC Container)** que resuelve y administra la instanciación de dependencias de forma automatizada. Al requerir un servicio o clase, el contenedor lo suministra sin intervención explícita del desarrollador, lo cual promueve el desacoplamiento de componentes y facilita la realización de pruebas unitarias.

---

## 2. Estructura Global de Directorios en Laravel

Conocer la organización de directorios resulta indispensable para desempeñarse eficazmente en Laravel:

```
mi-portafolio/
├── app/                        # Núcleo operativo del proyecto
│   ├── Console/                # Comandos personalizados para Artisan
│   ├── Exceptions/             # Control de excepciones y errores
│   ├── Http/
│   │   ├── Controllers/        # Controladores (Capa de control en MVC)
│   │   ├── Middleware/         # Filtros y capas intermedias de solicitudes
│   │   └── Requests/           # Validaciones de formularios (Form Requests)
│   ├── Models/                 # Entidades Eloquent (Capa de datos en MVC)
│   └── Providers/              # Proveedores de servicios (configuración del IoC)
│
├── bootstrap/                  # Proceso de arranque de la aplicación
├── config/                     # Archivos globales de configuración
├── database/
│   ├── factories/              # Generadores de información de prueba
│   ├── migrations/             # Definiciones del esquema de base de datos
│   └── seeders/                # Poblamiento inicial de tablas
│
├── public/                     # Punto de entrada público del servidor web
│   └── index.php               # Front Controller de la aplicación
│
├── resources/
│   ├── css/                    # Estilos en código fuente (procesados vía Vite)
│   ├── js/                     # Scripts de JavaScript fuente
│   └── views/                  # Vistas en Blade (Capa de presentación)
│
├── routes/
│   ├── web.php                 # Rutas de la interfaz web (con estado de sesión)
│   ├── api.php                 # Endpoints para la API REST (sin sesión)
│   └── console.php             # Comandos para la consola Artisan
│
├── storage/                    # Archivos en disco, logs del sistema y caché
├── tests/                      # Suite de pruebas unitarias y de integración
├── .env                        # Variables del entorno local (excluido de Git)
├── .env.example                # Plantilla de referencia para variables .env
├── artisan                     # Interfaz de línea de comandos de Laravel
└── composer.json               # Dependencias del paquete y paquetes PHP
```

---

## 3. Motor de Plantillas Blade

**Blade** es la herramienta de renderizado de vistas integrada en Laravel. A diferencia de otros sistemas de renderizado, Blade **admite código PHP nativo** dentro de las vistas, al tiempo que proporciona una sintaxis depurada e intuitiva sustentada en directivas propias.

### Directivas Clave de Blade

#### Herencia de Maquetas (`@extends`, `@yield`, `@section`)

El esquema de herencia en Blade posibilita crear una plantilla o *layout* maestro que es extendido por las páginas secundarias:

**`resources/views/layouts/app.blade.php`** (Estructura base):
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('titulo', 'Portafolio - Vasco Ramos')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @include('layouts.partials.navbar')

    <main class="container mx-auto px-4 py-8">
        @yield('contenido')
    </main>

    @include('layouts.partials.footer')
</body>
</html>
```

**`resources/views/productos/index.blade.php`** (Vista concreta):
```html
@extends('layouts.app')

@section('titulo', 'Catálogo de Productos')

@section('contenido')
    <h1 class="text-2xl font-bold mb-6">Catálogo de Productos</h1>

    @if($productos->isEmpty())
        <div class="alert alert-info">No hay productos disponibles.</div>
    @else
        <div class="grid grid-cols-3 gap-4">
            @foreach($productos as $producto)
                <div class="card">
                    <h3>{{ $producto->nombre }}</h3>
                    <p>S/ {{ number_format($producto->precio, 2) }}</p>
                    <a href="{{ route('productos.show', $producto->id) }}">Ver detalle</a>
                </div>
            @endforeach
        </div>

        {{-- Paginación automática de Laravel --}}
        {{ $productos->links() }}
    @endif
@endsection
```

### Sintaxis Fundamental de Blade

| Directiva | Propósito |
|---|---|
| `{{ $variable }}` | Renderiza datos con escape de caracteres HTML (mitiga XSS) |
| `{!! $html !!}` | Renderiza contenido HTML sin sanitizar (requiere precaución) |
| `@if / @elseif / @else / @endif` | Estructuras de control condicional |
| `@foreach / @endforeach` | Recorrido de colecciones y arreglos |
| `@for / @endfor` | Bucle for tradicional |
| `@while / @endwhile` | Bucle condicional while |
| `@forelse / @empty / @endforelse` | Recorrido iterativo con cláusula para datos vacíos |
| `@include('vista')` | Inserción de sub-vistas o componentes parciales |
| `@auth / @guest` | Comprobación del estado de sesión del usuario |
| `@csrf` | Inyección de token de protección contra ataques CSRF |

---

## 4. Eloquent ORM — Mapeo Objeto-Relacional

**Eloquent** representa el ORM (Object-Relational Mapper) incorporado en Laravel. Se fundamenta en el patrón de diseño **Active Record**, donde cada entidad o tabla de la base de datos se vincula con un Modelo de PHP, y cada registro de la tabla equivale a un objeto instanciado.

### Convenciones de Eloquent

Eloquent opera bajo convenciones predeterminadas que simplifican notablemente la configuración:
- La clase modelo `Producto` → se asocia a la tabla `productos` (pluralizado, minúsculas con guion bajo).
- La columna `id` actúa como la clave primaria estándar.
- Los atributos `created_at` y `updated_at` son gestionados de forma automática por el sistema.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Modelo Eloquent para la entidad Categoria.
 * Mapea a la tabla 'categorias' en la base de datos.
 */
class Categoria extends Model {
    use HasFactory, SoftDeletes; // SoftDeletes agrega la columna deleted_at

    /**
     * Atributos que se pueden asignar masivamente (Mass Assignment Protection).
     * Solo los campos listados aquí pueden modificarse con create() o update().
     */
    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'imagen_url',
        'activa',
    ];

    /**
     * Casting de atributos: convierte automáticamente el tipo de la columna.
     */
    protected $casts = [
        'activa'     => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ========================
    // RELACIONES DE ELOQUENT
    // ========================

    /**
     * Una Categoría tiene MUCHOS Productos (relación 1 a N).
     * La tabla 'productos' debe tener una columna 'categoria_id' (FK).
     */
    public function productos(): HasMany {
        return $this->hasMany(Producto::class, 'categoria_id');
    }

    /**
     * Una Categoría puede tener MUCHAS sub-categorías (auto-referencia).
     */
    public function subcategorias(): HasMany {
        return $this->hasMany(Categoria::class, 'categoria_padre_id');
    }

    // ========================
    // ACCESSORS Y MUTATORS
    // ========================

    /**
     * Accessor: $categoria->nombre_mayusculas
     * (Forma moderna con Attribute en Laravel 9+)
     */
    public function getNombreMayusculasAttribute(): string {
        return strtoupper($this->nombre);
    }
}
```

### Operaciones y Consultas con Eloquent

```php
<?php
// Obtener todas las categorías activas junto a sus productos asociados
$categorias = Categoria::where('activa', true)
    ->with('productos') // Eager Loading: resuelve y previene el problema N+1
    ->orderBy('nombre', 'asc')
    ->paginate(10);

// Registrar una nueva categoría
$nuevaCategoria = Categoria::create([
    'nombre'      => 'Electrónica',
    'slug'        => 'electronica',
    'descripcion' => 'Dispositivos electrónicos y accesorios',
    'activa'      => true,
]);

// Actualizar registros existentes
Categoria::where('id', 3)->update(['activa' => false]);

// Borrado lógico (SoftDelete: asigna valor a deleted_at sin remover la fila físicamente)
Categoria::find(5)->delete();
```

---

## 5. ¿Qué se aprendió?

La incursión en el ecosistema de Laravel significó una clara evolución dentro del itinerario académico:

- **El framework como impulsor de la productividad:** Se asimiló que Laravel no sustituye los cimientos conceptuales de PHP y la arquitectura MVC aprendidos anteriormente, sino que maximiza su potencial. El entendimiento profundo del enrutado interno y del ORM se apoya directamente en la práctica previa.

- **Utilidad de Artisan CLI:** Se examinó la herramienta interactiva de comandos `php artisan`, la cual permite automatizar la creación de controladores, entidades de modelo, migraciones de base de datos y pobladores (seeders), optimizando los tiempos de desarrollo.

- **Vistas dinámicas con Blade:** Se comprendió la ventaja de implementar un motor de maquetación moderno como Blade sobre la escritura tradicional de PHP incrustado en HTML, destacando una nítida separación de capas, sintaxis simplificada y protección XSS nativa mediante `{{ }}`.

- **Mapeo mediante Eloquent y gestión de relaciones:** Se apreció la capacidad del ORM para abstraer operaciones complejas de bases de datos mediante llamadas legibles en PHP, priorizando el uso de *Eager Loading* para anular el cuello de botella causado por la anomalía de consultas N+1.

---

## 6. ¿Cómo se aplicó?

Las actividades de desarrollo efectuadas durante la semana abarcaron:

1. **Configuración inicial del entorno en Laravel:** Se inicializó el proyecto mediante Composer, se configuró el fichero `.env` asociando los parámetros del servidor de base de datos MySQL local (XAMPP) y se ejecutó la orden `php artisan migrate` para construir la estructura inicial de tablas.

2. **Registro de rutas en `web.php`:** Se formalizaron las distintas rutas utilizando los métodos `Route::get()` y `Route::resource()`, empleando `php artisan route:list` para verificar e inspeccionar los accesos disponibles en la aplicación.

3. **Construcción de Modelos y Migraciones:** Se estructuraron las clases `Categoria` y `Producto` a la par con sus correspondientes migraciones mediante la instrucción `php artisan make:model Producto -m`, especificando los campos y tipos de datos mediante la API del Schema Builder.

4. **Desarrollo de interfaces con Blade:** Se diseñó la plantilla maestra de la aplicación junto a las pantallas de listado y detalle de artículos usando directivas Blade, aplicando herencia de maquetas y la reutilización de bloques mediante parciales.
