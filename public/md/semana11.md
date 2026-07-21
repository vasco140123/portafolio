# Semana 11: Framework Django: MTV, Modelos, Vistas y Plantillas

**Estudiante:** Vasco Qori Ramos Mercado
**Curso:** Desarrollo de Aplicaciones Web
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)
**Carrera:** Ingeniería de Sistemas
**Período:** 16 de junio – 20 de junio de 2026
**Herramientas:** Django, Python 3.x, SQLite / PostgreSQL

---

## 1. Patrón MTV de Django

**Django** destaca como el entorno de trabajo web más extendido y robusto del lenguaje Python. Desarrollado originalmente en 2003 con el propósito de gestionar la plataforma del periódico Lawrence Journal-World y liberado como software de código abierto en 2005, Django aplica con firmeza el principio de "baterías incluidas": suministra todas las herramientas requeridas para construir soluciones web de nivel empresarial sin necesidad de incorporar paquetes de terceros para las tareas operativas de rutina.

### MTV: la Variación de Django sobre MVC

Django implementa un enfoque derivado del patrón clásico MVC, denominado **MTV (Model-Template-View)**. Pese al ajuste en la nomenclatura, la división de responsabilidades se mantiene plenamente equivalente:

| Componente MVC | Componente MTV de Django | Responsabilidad |
|---|---|---|
| **Modelo** | **Model** | Administración de datos, mapeo ORM, validaciones de atributos y lógica de negocio |
| **Vista** | **Template** | Capa de interfaz gráfica en HTML respaldada por el motor de plantillas de Django |
| **Controlador** | **View** | Lógica de atención a la solicitud HTTP, intermediación entre Model y Template |
| *(Implícito)* | **URL Dispatcher** | Sistema de direccionamiento que vincula URLs con Views específicas (función del Enrutador) |

### El URL Dispatcher como Controlador Implícito

Dentro de la arquitectura de Django, el módulo `urls.py` asume las funciones tradicionales del "controlador" en cuanto al direccionamiento: asocia patrones de ruta con funciones o clases View. Este mecanismo guarda una amplia analogía con el `Router.php` diseñado previamente en la semana 5, pero totalmente ensamblado dentro del núcleo del marco de trabajo.

---

## 2. Instalación y Estructura del Proyecto Django

### Comandos de Instalación

```bash
# Construir y habilitar el entorno virtual
python -m venv entorno_django
entorno_django\Scripts\activate   # Windows

# Realizar la instalación del framework Django
pip install django

# Validar la versión operativa de Django
python -m django --version
# Django 4.2.x

# Inicializar un proyecto Django nuevo
django-admin startproject portafolio_uncp .
# El símbolo (.) establece la creación en el directorio presente

# Generar módulos o aplicaciones internas
python manage.py startapp productos
python manage.py startapp usuarios

# Poner en marcha el servidor de pruebas local
python manage.py runserver
# Dirección del servidor: http://127.0.0.1:8000/
```

### Proyecto Principal vs. Aplicaciones

Un matiz crucial dentro de Django reside en diferenciar el **proyecto** de las **aplicaciones**: el primero representa el contenedor global (almacena los ajustes centrales, las URLs raíz y la configuración global); mientras que las aplicaciones constituyen módulos aislados diseñados para cubrir funciones específicas (tales como control de acceso, catálogo de artículos, pedidos o blogs).

```
portafolio_uncp/               # Directorio raíz del proyecto
│
├── manage.py                  # Script de soporte para tareas administrativas
│
├── portafolio_uncp/           # Módulo principal de configuración
│   ├── __init__.py
│   ├── settings.py            # Archivo de ajustes globales
│   ├── urls.py                # Definición de rutas raíz del sistema
│   ├── asgi.py                # Interfaz para despliegues asíncronos (ASGI)
│   └── wsgi.py                # Interfaz para despliegues tradicionales (WSGI)
│
├── productos/                 # Aplicación dedicada a "productos"
│   ├── __init__.py
│   ├── admin.py               # Configuración para el panel de administración
│   ├── apps.py                # Parámetros del paquete de la app
│   ├── forms.py               # Declaración de formularios Django
│   ├── migrations/            # Historial y archivos de migración de base de datos
│   │   └── __init__.py
│   ├── models.py              # Definición de estructuras de datos (tablas)
│   ├── tests.py               # Pruebas unitarias y de integración
│   ├── urls.py                # Rutas locales específicas del módulo
│   └── views.py               # Controladores de respuesta (lógica de petición)
│
├── templates/                 # Directorio de plantillas HTML compartidas
│   ├── base.html
│   └── productos/
│       ├── lista.html
│       └── detalle.html
│
└── static/                    # Recursos estáticos (hojas de estilo CSS, scripts JS, imágenes)
```

### El archivo `settings.py`

```python
# Módulos y aplicaciones registradas en el proyecto
INSTALLED_APPS = [
    'django.contrib.admin',           # Módulo de administración integrada
    'django.contrib.auth',            # Mecanismo de autenticación e identidades
    'django.contrib.contenttypes',    # Gestor de tipos de contenido dinámico
    'django.contrib.sessions',        # Control de sesiones de usuario
    'django.contrib.messages',        # Sistema de notificación de mensajes flash
    'django.contrib.staticfiles',     # Administración de recursos estáticos
    # Aplicaciones desarrolladas para el proyecto
    'productos',
    'usuarios',
]

# Parámetros de la base de datos (configuración SQLite para desarrollo)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Regionalización e idioma
LANGUAGE_CODE = 'es-pe'
TIME_ZONE     = 'America/Lima'
USE_I18N      = True
USE_TZ        = True
```

---

## 3. Gestión de URLs y Vistas

### Configuración de URLs

```python
# portafolio_uncp/urls.py (Definición de rutas globales del proyecto)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('productos/', include('productos.urls')),  # Delegación al enrutador de la app
    path('api/', include('api.urls')),
]
```

```python
# productos/urls.py (Enrutamiento específico de la aplicación productos)
from django.urls import path
from . import views

app_name = 'productos'  # Espacio de nombres para la resolución inversa de URLs

urlpatterns = [
    path('',            views.ProductoListView.as_view(),   name='lista'),
    path('<int:pk>/',   views.ProductoDetailView.as_view(), name='detalle'),
    path('crear/',      views.ProductoCreateView.as_view(), name='crear'),
    path('<int:pk>/editar/',  views.ProductoUpdateView.as_view(), name='editar'),
    path('<int:pk>/eliminar/', views.ProductoDeleteView.as_view(), name='eliminar'),
]
```

### Function-Based Views (FBV)

Las vistas fundamentadas en funciones se distinguen por su sencillez: reciben una instancia de `HttpRequest` y retornan un objeto de tipo `HttpResponse`:

```python
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpRequest, HttpResponse
from .models import Producto

def lista_productos(request: HttpRequest) -> HttpResponse:
    """Vista FBV: genera el catálogo de elementos disponibles."""
    productos = Producto.objects.filter(activo=True).order_by('-creado_en')
    contexto  = {
        'productos': productos,
        'titulo'   : 'Catálogo de Productos',
    }
    return render(request, 'productos/lista.html', contexto)
```

### Class-Based Views (CBV)

Las vistas basadas en clases se construyen heredando de las clases genéricas que provee Django, disminuyendo drásticamente la escritura de código reiterativo:

```python
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy

class ProductoListView(ListView):
    model         = Producto
    template_name = 'productos/lista.html'
    context_object_name = 'productos'
    paginate_by   = 12  # División de resultados en páginas automáticamente

    def get_queryset(self):
        """Ajuste de la consulta para obtener únicamente registros activos."""
        return Producto.objects.filter(activo=True).select_related('categoria')

class ProductoDetailView(DetailView):
    model         = Producto
    template_name = 'productos/detalle.html'
```

---

## 4. Uso de Plantillas Django

El motor de renderizado de plantillas de Django emplea la notación de doble llave `{{ }}` para la inyección de variables y `{% %}` para la ejecución de bloques de control (tags):

**`templates/base.html`:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{% block titulo %}Portafolio UNCP{% endblock %}</title>
    {% load static %}
    <link rel="stylesheet" href="{% static 'css/styles.css' %}">
</head>
<body>
    <nav>
        <a href="{% url 'productos:lista' %}">Productos</a>
        {% if user.is_authenticated %}
            <span>Hola, {{ user.username }}</span>
            <a href="{% url 'logout' %}">Salir</a>
        {% else %}
            <a href="{% url 'login' %}">Iniciar sesión</a>
        {% endif %}
    </nav>

    <main>
        {% if messages %}
            {% for message in messages %}
                <div class="alert alert-{{ message.tags }}">{{ message }}</div>
            {% endfor %}
        {% endif %}

        {% block contenido %}{% endblock %}
    </main>
</body>
</html>
```

**`templates/productos/lista.html`:**
```html
{% extends 'base.html' %}

{% block titulo %}Catálogo de Productos{% endblock %}

{% block contenido %}
<h1>Catálogo de Productos</h1>

{% if productos %}
    <div class="grid">
        {% for producto in productos %}
        <article class="card">
            <h3>{{ producto.nombre }}</h3>
            <p class="precio">S/ {{ producto.precio|floatformat:2 }}</p>
            <p>{{ producto.descripcion|truncatewords:20 }}</p>
            <a href="{% url 'productos:detalle' producto.pk %}">Ver más</a>
        </article>
        {% endfor %}
    </div>

    {# Inclusión de componente de navegación por páginas #}
    {% include 'includes/paginacion.html' %}
{% else %}
    <p>No hay productos disponibles en este momento.</p>
{% endif %}
{% endblock %}
```

---

## 5. Modelos y ORM de Django

Los modelos en Django se definen mediante clases de Python que representan de manera transparente las tablas de la base de datos:

```python
# productos/models.py
from django.db import models
from django.utils.text import slugify
from django.urls import reverse

class Categoria(models.Model):
    """Estructura para categorizar productos."""
    nombre      = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    slug        = models.SlugField(max_length=120, unique=True, blank=True)
    descripcion = models.TextField(blank=True, verbose_name="Descripción")
    activa      = models.BooleanField(default=True, verbose_name="¿Activa?")
    creado_en   = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name        = "Categoría"
        verbose_name_plural = "Categorías"
        ordering            = ['nombre']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.nombre


class Producto(models.Model):
    """Modelo de catálogo vinculado a una Categoría."""
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('agotado',    'Agotado'),
        ('descontinuado', 'Descontinuado'),
    ]

    nombre      = models.CharField(max_length=200, verbose_name="Nombre del producto")
    slug        = models.SlugField(max_length=220, unique=True, blank=True)
    descripcion = models.TextField(verbose_name="Descripción")
    precio      = models.DecimalField(max_digits=10, decimal_places=2)
    stock       = models.PositiveIntegerField(default=0)
    estado      = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible')
    imagen      = models.ImageField(upload_to='productos/', blank=True, null=True)
    activo      = models.BooleanField(default=True)
    
    # Enlace asociativo ForeignKey: múltiples Productos referencian una Categoría
    categoria   = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,  # Impide el borrado de categorías con artículos asociados
        related_name='productos',  # Relación inversa: categoria.productos.all()
        verbose_name="Categoría"
    )

    creado_en      = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "Producto"
        verbose_name_plural = "Productos"
        ordering            = ['-creado_en']

    def __str__(self) -> str:
        return f"{self.nombre} (S/ {self.precio})"

    def get_absolute_url(self):
        return reverse('productos:detalle', kwargs={'pk': self.pk})

    @property
    def esta_disponible(self) -> bool:
        return self.activo and self.stock > 0 and self.estado == 'disponible'
```

### Migraciones: Versionado del Esquema de BD

```bash
# Producir los ficheros de migración detectando ajustes en models.py
python manage.py makemigrations productos

# Ejecutar la actualización sobre la base de datos
python manage.py migrate

# Consultar el estado del historial de migraciones
python manage.py showmigrations

# Previsualizar el código SQL equivalente generado por una migración
python manage.py sqlmigrate productos 0001_initial
```

---

## 6. Django Admin Panel

Django cuenta con un entorno administrativo preconstruido y plenamente funcional que se estructura de modo automático al registrar los modelos correspondientes:

```python
# productos/admin.py
from django.contrib import admin
from .models import Categoria, Producto

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display   = ['nombre', 'activa', 'creado_en']
    list_filter    = ['activa']
    search_fields  = ['nombre', 'descripcion']
    prepopulated_fields = {'slug': ('nombre',)}  # Generación automática del slug

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display         = ['nombre', 'categoria', 'precio', 'stock', 'esta_disponible_admin']
    list_filter          = ['activo', 'estado', 'categoria']
    search_fields        = ['nombre', 'descripcion']
    list_editable        = ['precio', 'stock']  # Modificación directa en la vista de lista
    readonly_fields      = ['creado_en', 'actualizado_en']
    prepopulated_fields  = {'slug': ('nombre',)}

    def esta_disponible_admin(self, obj) -> bool:
        return obj.esta_disponible
    esta_disponible_admin.boolean     = True  # Muestra gráfico de estado booleano
    esta_disponible_admin.short_description = '¿Disponible?'
```

```bash
# Dar de alta al administrador principal (superusuario)
python manage.py createsuperuser
# Acceso mediante la dirección: http://127.0.0.1:8000/admin/
```

---

## 7. Reflexión Personal sobre la Productividad de Django

Evolucionar desde la implementación manual de operaciones CRUD empleando PHP puro con PDO (semana 4) hacia la réplica de este proceso dentro de Django significó un hallazgo determinante respecto al **rendimiento en el desarrollo** que garantiza un framework consolidado provisto de "baterías incluidas".

Durante el trabajo con PHP, establecer el enlace a la base de datos, estructurar el enrutador, gestionar la autenticación y fabricar el panel de administración requirió múltiples jornadas de programación. En contraste, con Django, las capacidades del ORM, el control versionado mediante migraciones, el subsistema de credenciales y la interfaz administrativa quedan a disposición tras definir los modelos pertinentes y procesar un par de instrucciones por consola.

No obstante, este beneficio presupone una curva de adaptación: Django promueve un patrón de trabajo bien delimitado (convenciones firmes en la organización de proyectos, la secuencia sintáctica URL→View→Template, y la interacción con datos mediante QuerySet API), por lo que apartarse de dichas directrices introduce complicaciones innecesarias. Lo fundamental consiste en incorporar la mentalidad del **Zen de Django**: confiar en las soluciones estándar del framework, acatar sus convenios y sacar el máximo provecho de sus componentes nativos.

El aspecto que más pondero sobre Django radica en la **capacidad de escalabilidad nativa** de su diseño: un proyecto formulado apropiadamente en Django posee el potencial de evolucionar desde una solución básica hasta un servicio capaz de atender a millones de usuarios (como aconteció con Instagram en sus inicios) sin requerir una reestructuración integral desde cero.
