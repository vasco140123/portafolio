# Semana 13: Desarrollo de APIs RESTful utilizando Django REST Framework (DRF)

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 30 de junio – 04 de julio de 2026  
**Herramientas:** Django REST Framework, Postman, CORS  

---

## 1. Introducción a REST

**REST (Transferencia de Estado Representacional)** constituye un patrón de arquitectura de software enfocado en la estructuración de sistemas distribuidos a través de redes. Presentado formalmente por Roy Fielding durante el año 2000 en su investigación doctoral, actualmente representa la norma principal para concebir e implementar APIs web.

### Los 6 Principios de REST

1. **Arquitectura Cliente-Servidor:** Desacoplamiento explícito entre la interfaz de usuario (lado del cliente) y la persistencia de datos (lado del servidor), facilitando el desarrollo autónomo de ambos componentes.

2. **Ausencia de Estado (Stateless):** Toda solicitud enviada por el cliente requiere incluir la totalidad de datos indispensables para su procesamiento. La parte servidora no conserva información de contexto entre transacciones.

3. **Almacenamiento en Caché (Cacheable):** Las respuestas enviadas deben explicitar si son aptas para guardarse temporalmente, optimizando así el rendimiento global.

4. **Organización en Capas (Layered System):** La aplicación cliente no necesita distinguir si interactúa de manera directa con el servidor final o a través de nodos intermedios (como proxies, balanceadores de carga o redes CDN).

5. **Interfaz Standarizada:** La API se rige por convenciones universales: identificación de entidades mediante URLs, modificación de recursos a través de representaciones, mensajes autodescriptivos y la integración de HATEOAS.

6. **Ejecución de Código a Petición (opcional):** El servidor cuenta con la capacidad de transferir código ejecutable (como scripts en JavaScript) directamente hacia el cliente.

### Identificación de Recursos mediante URLs

Dentro del paradigma REST, cualquier elemento que el sistema administre se considera un **recurso**, asignándosele a cada uno una dirección URL exclusiva:

```
https://api.portafolio.uncp.edu.pe/v1/estudiantes/
https://api.portafolio.uncp.edu.pe/v1/estudiantes/42/
https://api.portafolio.uncp.edu.pe/v1/estudiantes/42/materias/
```

---

## 2. Estructuración y Diseño de Endpoints

La correcta concepción de los endpoints resulta fundamental durante el desarrollo de APIs con estándares profesionales. Fallos en el diseño de estas rutas suelen ser complejos de subsanar una vez que los servicios se encuentran operativos en producción.

### Pautas de Nomenclatura

```
 Correcto (uso de sustantivos en plural, caracteres en minúscula y guiones)
GET    /api/v1/productos/                → Consultar el catálogo completo de productos
POST   /api/v1/productos/                → Registrar un producto nuevo
GET    /api/v1/productos/5/              → Consultar el producto con identificador 5
PUT    /api/v1/productos/5/              → Modificar totalmente el producto 5
PATCH  /api/v1/productos/5/              → Modificar parcialmente el producto 5
DELETE /api/v1/productos/5/              → Remover el producto 5
GET    /api/v1/productos/5/reseñas/      → Obtener reseñas vinculadas al producto 5 (subrecurso)
POST   /api/v1/productos/5/reseñas/      → Agregar una opinión sobre el producto 5

 Incorrecto (inclusión de verbos en la URL, alterando la claridad semántica)
GET    /api/v1/obtener-productos/
POST   /api/v1/crear-producto/
GET    /api/v1/producto?id=5
GET    /api/v1/eliminar-producto/5/
```

---

## 3. Conversión y Serialización de Modelos mediante DRF

**Django REST Framework (DRF)** representa el paquete más empleado para elaborar APIs RESTful dentro del ecosistema de Django. El elemento clave de esta herramienta es el **Serializer**, encargado de transformar instancias de objetos en Python (modelos de Django) a formatos de estructuración de información como JSON, y viceversa.

### Proceso de Instalación y Ajuste Inicial de DRF

```bash
pip install djangorestframework django-cors-headers
```

```python
# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Requiere ubicarse de forma previa a CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    ...
]

# Parámetros globales de DRF
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/hour',
        'user': '1000/day',
    },
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',  # Exclusivo para desarrollo
    ],
}

# Reglas CORS (para autorizar llamadas desde el cliente frontend)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # Entorno de React en desarrollo
    "http://localhost:5173",   # Entorno de Vite en desarrollo
    "https://portafolio.uncp.edu.pe",  # Servidor de producción
]
```

### Uso de Serializers: Transformación entre Python y JSON

```python
# productos/serializers.py
from rest_framework import serializers
from .models import Producto, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    """Serializador fundamental para el modelo Categoria."""
    total_productos = serializers.SerializerMethodField()

    class Meta:
        model  = Categoria
        fields = ['id', 'nombre', 'slug', 'descripcion', 'activa', 'total_productos']
        read_only_fields = ['slug', 'total_productos']

    def get_total_productos(self, obj) -> int:
        """Atributo computado: calcula la cantidad de productos en estado activo pertenecientes a la categoría."""
        return obj.productos.filter(activo=True).count()


class ProductoListSerializer(serializers.ModelSerializer):
    """Serializador reducido para listados generales (optimiza el peso de la respuesta)."""
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    precio_display   = serializers.SerializerMethodField()

    class Meta:
        model  = Producto
        fields = ['id', 'nombre', 'slug', 'precio', 'precio_display',
                  'stock', 'categoria_nombre', 'esta_disponible']

    def get_precio_display(self, obj) -> str:
        return f"S/ {obj.precio:,.2f}"


class ProductoDetailSerializer(serializers.ModelSerializer):
    """Serializador detallado para vistas individuales (incluye la totalidad de los atributos)."""
    categoria = CategoriaSerializer(read_only=True)   # Estructura anidada completa
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.filter(activa=True),
        source='categoria',
        write_only=True    # Exclusivo para operaciones de escritura (POST/PUT)
    )
    creado_en      = serializers.DateTimeField(format='%d/%m/%Y %H:%M', read_only=True)
    actualizado_en = serializers.DateTimeField(format='%d/%m/%Y %H:%M', read_only=True)

    class Meta:
        model  = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion', 'precio',
            'stock', 'estado', 'imagen', 'activo',
            'categoria', 'categoria_id',
            'creado_en', 'actualizado_en'
        ]
        read_only_fields = ['slug', 'creado_en', 'actualizado_en']

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a cero.")
        return value

    def validate(self, data):
        """Reglas de validación a nivel de objeto (evalúa múltiples atributos)."""
        if data.get('stock', 0) == 0 and data.get('estado') == 'disponible':
            raise serializers.ValidationError(
                "Un producto sin stock no puede tener estado 'disponible'."
            )
        return data
```

---

## 4. Mecanismos de Filtrado, Paginación y Control de Tasa (Rate Limiting)

### Búsqueda y Filtrado Avanzado utilizando django-filter

```bash
pip install django-filter
```

```python
# productos/filters.py
import django_filters
from .models import Producto

class ProductoFilter(django_filters.FilterSet):
    precio_min   = django_filters.NumberFilter(field_name='precio', lookup_expr='gte')
    precio_max   = django_filters.NumberFilter(field_name='precio', lookup_expr='lte')
    nombre       = django_filters.CharFilter(lookup_expr='icontains')
    categoria    = django_filters.CharFilter(field_name='categoria__slug')

    class Meta:
        model  = Producto
        fields = ['activo', 'estado', 'categoria']

# Ejemplo de llamada en ViewSet:
# GET /api/v1/productos/?precio_min=100&precio_max=500&nombre=laptop&activo=true
```

### Configuración de Paginación a Medida

```python
# portafolio_uncp/pagination.py
from rest_framework.pagination import PageNumberPagination

class PaginacionEstandar(PageNumberPagination):
    page_size              = 20          # Cantidad predeterminada de elementos por página
    page_size_query_param  = 'size'      # ?size=50
    max_page_size          = 100         # Límite máximo de elementos por página

    def get_paginated_response(self, data):
        return Response({
            'pagina_actual' : self.page.number,
            'total_paginas' : self.page.paginator.num_pages,
            'total_items'   : self.page.paginator.count,
            'siguiente'     : self.get_next_link(),
            'anterior'      : self.get_previous_link(),
            'resultados'    : data,
        })
```

---

## 5. Implementación de ViewSets y Enrutadores (Routers)

### ModelViewSet: Gestión Integrada de Operaciones CRUD

La clase `ModelViewSet` unifica dentro de una única estructura las acciones básicas de **list**, **create**, **retrieve**, **update**, **partial_update** y **destroy**:

```python
# productos/views_api.py
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Producto, Categoria
from .serializers import ProductoDetailSerializer, ProductoListSerializer, CategoriaSerializer
from .filters import ProductoFilter

class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet enfocado en la administración integral del recurso Producto.
    Genera automáticamente las acciones: list, create, retrieve, update, destroy.
    """
    queryset         = Producto.objects.select_related('categoria').order_by('-creado_en')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Filtrado y búsqueda
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class  = ProductoFilter
    search_fields    = ['nombre', 'descripcion']
    ordering_fields  = ['precio', 'creado_en', 'nombre']
    ordering         = ['-creado_en']

    def get_serializer_class(self):
        """Selección dinámica de serializadores en función de la acción ejecutada."""
        if self.action == 'list':
            return ProductoListSerializer
        return ProductoDetailSerializer

    @action(detail=True, methods=['post'], url_path='toggle-activo')
    def toggle_activo(self, request, pk=None):
        """Acción personalizada para alternar el estado activo del producto."""
        producto = self.get_object()
        producto.activo = not producto.activo
        producto.save(update_fields=['activo'])
        estado = 'activado' if producto.activo else 'desactivado'
        return Response({'mensaje': f'Producto {estado} exitosamente.'})
```

### Generación Automática de Rutas mediante DefaultRouter

```python
# api/urls.py
from rest_framework.routers import DefaultRouter
from productos.views_api import ProductoViewSet, CategoriaViewSet

router = DefaultRouter()
router.register(r'productos',  ProductoViewSet,  basename='producto')
router.register(r'categorias', CategoriaViewSet, basename='categoria')

# El enrutador construye automáticamente las siguientes direcciones:
# GET    /api/v1/productos/           → list
# POST   /api/v1/productos/           → create
# GET    /api/v1/productos/{id}/      → retrieve
# PUT    /api/v1/productos/{id}/      → update
# PATCH  /api/v1/productos/{id}/      → partial_update
# DELETE /api/v1/productos/{id}/      → destroy
# POST   /api/v1/productos/{id}/toggle-activo/ → acción personalizada

urlpatterns = router.urls
```

---

## 6. Interacción AJAX, Protección CSRF y Mecanismos CORS

### Manejo de Tokens CSRF en Solicitudes AJAX

Al realizar peticiones asíncronas vía AJAX desde el cliente JavaScript hacia el servidor en Django, resulta indispensable incorporar la cabecera con el token CSRF:

```javascript
// JavaScript de cliente — llamada AJAX incorporando token CSRF
async function crearProducto(datosProducto) {
    // Extracción de la clave CSRF almacenada en la cookie
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

    const response = await fetch('/api/v1/productos/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,  // Cabecera exigida por Django
        },
        body: JSON.stringify(datosProducto),
    });

    if (!response.ok) {
        const errores = await response.json();
        throw new Error(JSON.stringify(errores));
    }

    return await response.json();
}
```

### Intercambio de Recursos de Origen Cruzado (CORS)

El protocolo CORS (Cross-Origin Resource Sharing) constituye una política de seguridad aplicada por los navegadores para restringir solicitudes HTTP entre orígenes diferentes. Así, si la interfaz en React alojada en `http://localhost:3000` busca comunicarse con el servidor Django en `http://localhost:8000`, la llamada será interceptada a menos que la API emita los encabezados CORS pertinentes:

```python
# settings.py — Parámetros de corsheaders
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True  # Habilita el envío de cookies entre dominios distintos

CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization',
    'content-type', 'dnt', 'origin', 'user-agent',
    'x-csrftoken', 'x-requested-with',
]
```

---

## 7. Análisis Reflexivo: Comparativa entre APIs y Vistas HTML Tradicionales

Durante esta semana experimenté un cambio fundamental en el enfoque de desarrollo: evolucionar desde la maquetación de "páginas web" hacia la estructuración de "endpoints proveedores de información". Dicha discrepancia es radical y genera consecuencias directas en la arquitectura del software.

En los esquemas tradicionales con renderizado del lado del servidor (SSR), el backend y el frontend conviven fuertemente acoplados; el servidor produce el documento HTML integro que combina la lógica con la vista. En contraste, con una API REST el servidor se limita a suministrar **datos en formato JSON**, transfiriendo la responsabilidad de la capa visual al cliente (como React, Vue, aplicaciones móviles o herramientas tipo Postman).

Dicho desacoplamiento ofrece importantes fortalezas: la misma interfaz de programación puede alimentar simultáneamente un sitio web en React, una aplicación nativa para Android o iOS, un bot interactivo de Telegram o plataformas empresariales externas, sin necesidad de alterar la lógica del servidor.

Un elemento especialmente destacable fue la **Browsable API** que brinda DRF. La posibilidad de inspeccionar la API directamente desde el navegador y ejecutar pruebas en los endpoints sin requerir software externo como Postman resulta ser una utilidad didáctica sobresaliente, evidenciando que Django REST Framework prioriza tanto el flujo de trabajo del desarrollador como la efectividad de la solución.

En el contexto profesional peruano, comprendo que el dominio de DRF adquiere día a día mayor trascendencia, ya que las empresas tecnológicas y startups locales orientan con rapidez sus soluciones hacia modelos de **backend orientado a servicios API** combinados con **frontends independientes** (tales como SPAs o apps para dispositivos móviles).
