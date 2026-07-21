# Semana 12: Formularios, Autenticación y Middleware en Django

**Estudiante:** Vasco Qori Ramos Mercado
**Curso:** Desarrollo de Aplicaciones Web
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)
**Carrera:** Ingeniería de Sistemas
**Período:** 23 de junio – 27 de junio de 2026
**Herramientas:** Django Forms, Django Auth, Middleware

---

## 1. Gestión de Formularios en Django

Los formularios constituyen el canal fundamental mediante el cual los usuarios interactúan y envían información hacia una aplicación web. Django provee un subsistema de formularios altamente integrado que automatiza la producción del código HTML, la recepción de parámetros, su validación y los procesos de depuración o sanitización.

### Form vs. ModelForm

Django incorpora dos variantes principales para construir formularios:

| Tipo | Cuándo usar | Vinculado a |
|---|---|---|
| `forms.Form` | Formularios genéricos desconectados directamente de una entidad de base de datos | Ningún modelo específico |
| `forms.ModelForm` | Formulario orientado al alta, edición o actualización de registros | Un modelo concreto de Django |

### Ciclo de vida de un Formulario Django

```
1. El usuario efectúa la petición a la URL (solicitud GET)
   → Se construye la instancia inicial del formulario (vacío) y se renderiza en pantalla

2. El usuario llena y transmite los datos (solicitud POST)
   → Se instancia la clase Form/ModelForm alimentada con la información recibida por POST
   → Se efectúa la llamada al método form.is_valid()
   → En caso afirmativo (válido): se procesan y almacenan los datos
   → En caso negativo (inválido): se vuelve a mostrar la plantilla exponiendo las alertas de error
```

### Implementación de Formularios

```python
# productos/forms.py
from django import forms
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import Producto, Categoria

# Formulario independiente (no enlazado directamente a un modelo)
class BusquedaProductoForm(forms.Form):
    termino     = forms.CharField(
        max_length=100,
        required=False,
        label="Buscar producto",
        widget=forms.TextInput(attrs={
            'class':       'form-control',
            'placeholder': 'Nombre del producto...'
        })
    )
    categoria   = forms.ModelChoiceField(
        queryset=Categoria.objects.filter(activa=True),
        required=False,
        empty_label="Todas las categorías"
    )
    precio_min  = forms.DecimalField(
        required=False,
        min_value=0,
        label="Precio mínimo (S/)"
    )
    precio_max  = forms.DecimalField(
        required=False,
        min_value=0,
        label="Precio máximo (S/)"
    )

    def clean(self):
        """Validación cruzada que involucra múltiples entradas."""
        datos = super().clean()
        precio_min = datos.get('precio_min')
        precio_max = datos.get('precio_max')

        if precio_min and precio_max and precio_min > precio_max:
            raise forms.ValidationError(
                "El precio mínimo no puede ser mayor que el precio máximo."
            )
        return datos


# ModelForm: directamente asociado a la entidad Producto
class ProductoForm(forms.ModelForm):
    class Meta:
        model  = Producto
        fields = ['nombre', 'descripcion', 'precio', 'stock', 'categoria', 'imagen', 'activo']
        labels = {
            'nombre':      'Nombre del Producto',
            'descripcion': 'Descripción Detallada',
            'precio':      'Precio (S/)',
        }
        widgets = {
            'nombre':      forms.TextInput(attrs={'class': 'form-control'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'precio':      forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'stock':       forms.NumberInput(attrs={'class': 'form-control', 'min': '0'}),
        }
        help_texts = {
            'slug': 'Se generará automáticamente si se deja vacío.',
        }

    def clean_nombre(self) -> str:
        """Validación enfocada en la regla del atributo 'nombre'."""
        nombre = self.cleaned_data.get('nombre', '').strip()
        if len(nombre) < 3:
            raise forms.ValidationError("El nombre debe tener al menos 3 caracteres.")
        # Comprobación de unicidad (omitiendo la entidad actual si estamos editando)
        qs = Producto.objects.filter(nombre__iexact=nombre)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("Ya existe un producto con este nombre.")
        return nombre.title()  # Formato con iniciales en mayúscula

    def clean_precio(self):
        precio = self.cleaned_data.get('precio')
        if precio and precio <= 0:
            raise forms.ValidationError("El precio debe ser mayor a cero.")
        return precio
```

---

## 2. Validación y Sanitización

### El método `is_valid()` y `cleaned_data`

Cuando Django realiza el análisis de un formulario procesado, ejecuta secuencialmente las comprobaciones descritas a continuación:

1. **Verificación de tipo de dato:** ¿El valor entregado coincide con la naturaleza del campo? (p. ej., que un `IntegerField` reciba efectivamente un valor numérico).
2. **Cumplimiento de restricciones fijas:** ¿El parámetro atiende reglas como `max_length`, `min_value`, etc.?
3. **Ejecución de métodos `clean_<campo>()`:** Filtros y reglas específicas por propiedad.
4. **Ejecución del método `clean()`:** Reglas de negocio globales que combinan varios campos a la vez.

```python
# productos/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import ProductoForm
from .models import Producto

def crear_producto(request):
    if request.method == 'POST':
        form = ProductoForm(request.POST, request.FILES)

        if form.is_valid():
            # cleaned_data suministra información completamente depurada y segura
            producto = form.save()
            messages.success(request, f'Producto "{producto.nombre}" creado exitosamente.')
            return redirect('productos:detalle', pk=producto.pk)
        else:
            messages.error(request, 'Por favor corrija los errores del formulario.')
    else:
        form = ProductoForm()  # Instancia limpia para solicitudes GET

    return render(request, 'productos/formulario.html', {'form': form})
```

### Renderizado de Formularios en Plantilla

```html
{# templates/productos/formulario.html #}
{% extends 'base.html' %}
{% block contenido %}
<form method="post" enctype="multipart/form-data" novalidate>
    {% csrf_token %}

    {% for field in form %}
        <div class="form-group mb-3">
            <label for="{{ field.id_for_label }}">{{ field.label }}</label>
            {{ field }}
            {% if field.help_text %}
                <small class="form-text text-muted">{{ field.help_text }}</small>
            {% endif %}
            {% for error in field.errors %}
                <div class="invalid-feedback d-block">{{ error }}</div>
            {% endfor %}
        </div>
    {% endfor %}

    {% if form.non_field_errors %}
        <div class="alert alert-danger">{{ form.non_field_errors }}</div>
    {% endif %}

    <button type="submit" class="btn btn-primary">Guardar</button>
</form>
{% endblock %}
```

---

## 3. Django Admin Avanzado

### Personalización del Panel de Administración

El panel de administración de Django ofrece un alto grado de extensión mediante la parametrización de la clase `ModelAdmin`:

```python
# productos/admin.py
from django.contrib import admin
from django.db.models import Sum, Count
from django.utils.html import format_html
from .models import Producto, Categoria

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    # Definición de las columnas visibles en el listado general
    list_display = [
        'nombre', 'categoria', 'precio_formato',
        'stock', 'disponibilidad_badge', 'activo', 'creado_en'
    ]

    # Opciones de filtrado en el panel lateral derecho
    list_filter = ['activo', 'estado', 'categoria', 'creado_en']

    # Búsqueda rápida por campos de texto
    search_fields = ['nombre', 'descripcion', 'categoria__nombre']

    # Permite la actualización directa de atributos desde la tabla sin abrir el detalle
    list_editable = ['stock', 'activo']

    # Atributos restringidos únicamente a modo lectura
    readonly_fields = ['creado_en', 'actualizado_en', 'slug']

    # Estructuración de los componentes en el formulario detallado
    fieldsets = [
        ('Información Principal', {
            'fields': ('nombre', 'slug', 'descripcion', 'imagen')
        }),
        ('Precio y Stock', {
            'fields': ('precio', 'stock', 'estado'),
            'classes': ('wide',)
        }),
        ('Clasificación', {
            'fields': ('categoria', 'activo')
        }),
        ('Metadatos', {
            'fields': ('creado_en', 'actualizado_en'),
            'classes': ('collapse',)  # Sección desplegable/colapsable
        }),
    ]

    # ─── Definición de columnas calculadas ───────────────────────────────
    def precio_formato(self, obj) -> str:
        return f"S/ {obj.precio:,.2f}"
    precio_formato.short_description = 'Precio'
    precio_formato.admin_order_field = 'precio'  # Habilita el ordenamiento dinámico por esta columna

    def disponibilidad_badge(self, obj):
        color  = 'green' if obj.esta_disponible else 'red'
        texto  = 'Disponible' if obj.esta_disponible else 'No disponible'
        return format_html('<span style="color: {};">● {}</span>', color, texto)
    disponibilidad_badge.short_description = 'Estado'
```

---

## 4. Middleware en Django

El **Middleware** actúa como una capa de procesamiento intermedia ubicada entre la recepción de la petición HTTP externa y la vista destino de Django. Cada componente middleware posee la facultad de examinar, modificar o interrumpir el flujo normal de peticiones y respuestas.

### El orden de ejecución del Middleware

```
Petición entrante desde la red
    │
    ▼
Middleware 1 (fase de recepción/proceso de petición)
    │
    ▼
Middleware 2 (fase de recepción/proceso de petición)
    │
    ▼
    ...
    │
    ▼
Vista (View de la aplicación)
    │
    ▼
    ...
    │
    ▼
Middleware 2 (fase de respuesta/proceso de salida) ← Orden INVERSO (LIFO)
    │
    ▼
Middleware 1 (fase de respuesta/proceso de salida)
    │
    ▼
Emisión de la respuesta al cliente
```

### Middleware por Defecto en Django

```python
# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',         # Inyección de cabeceras de seguridad HTTP
    'django.contrib.sessions.middleware.SessionMiddleware',  # Administración y persistencia de sesiones
    'django.middleware.common.CommonMiddleware',              # Tratamiento de barras finales (slashes), etc.
    'django.middleware.csrf.CsrfViewMiddleware',             # Protección anti-falsificación CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Vinculación de request.user
    'django.contrib.messages.middleware.MessageMiddleware',  # Control de alertas temporales (flash)
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Encabezado para prevención de Clickjacking
]
```

### Crear un Middleware Personalizado

```python
# portafolio_uncp/middleware.py
import time
import logging

logger = logging.getLogger(__name__)

class TiempoRespuestaMiddleware:
    """Middleware diseñado para calcular y registrar la latencia de respuesta en cada petición."""

    def __init__(self, get_response):
        self.get_response = get_response
        # Ejecución única durante el arranque inicial del servidor

    def __call__(self, request):
        # Lógica ejecutada ANTES de pasar el control a la vista
        tiempo_inicio = time.perf_counter()

        response = self.get_response(request)  # Transferencia de control a la vista

        # Lógica ejecutada DESPUÉS del procesamiento en la vista
        tiempo_total = (time.perf_counter() - tiempo_inicio) * 1000  # Expresado en milisegundos

        logger.info(
            f"{request.method} {request.path} → "
            f"{response.status_code} | {tiempo_total:.2f}ms"
        )

        # Inserción de la métrica en las cabeceras HTTP de respuesta (útil para diagnóstico)
        response['X-Response-Time'] = f"{tiempo_total:.2f}ms"
        return response
```

---

## 5. Sesiones, Autenticación y Autorización

### Sistema de Autenticación de Django

Django incorpora de manera nativa un esquema completo de credenciales para usuarios, gestión de grupos y asignación de permisos:

```python
# Definición de rutas de autenticación en urls.py
from django.contrib.auth import views as auth_views
from django.urls import path

urlpatterns = [
    path('login/',  auth_views.LoginView.as_view(template_name='auth/login.html'),  name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('password/change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
]
```

```python
# Uso de decoradores de control de acceso en vistas
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.views.generic import CreateView

# Aplicado en vistas basadas en funciones
@login_required(login_url='/login/')
def mi_perfil(request):
    return render(request, 'usuarios/perfil.html', {'usuario': request.user})

@login_required
@permission_required('productos.add_producto', raise_exception=True)
def crear_producto_admin(request):
    # Exclusivamente accesible por usuarios dotados del permiso 'productos.add_producto'
    ...

# Aplicado en vistas basadas en clases
class ProductoCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model              = Producto
    form_class         = ProductoForm
    template_name      = 'productos/formulario.html'
    permission_required = 'productos.add_producto'
    login_url          = '/login/'

    def form_valid(self, form):
        # Registro automático del usuario en sesión como autor del registro
        form.instance.creado_por = self.request.user
        return super().form_valid(form)
```

### Autenticación Personalizada

```python
# usuarios/views.py
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages

def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')  # El usuario ya dispone de una sesión activa

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        usuario = authenticate(request, username=username, password=password)

        if usuario is not None:
            login(request, usuario)  # Apertura formal de la sesión
            messages.success(request, f'Bienvenido, {usuario.get_full_name() or usuario.username}!')
            # Redirección a la ruta previa guardada en 'next' o al inicio
            next_url = request.GET.get('next', 'home')
            return redirect(next_url)
        else:
            messages.error(request, 'Usuario o contraseña incorrectos.')

    return render(request, 'auth/login.html')
```

---

## 6. Reflexión Personal sobre Seguridad y Gestión de Usuarios

El aprendizaje de esta semana me permitió valorar profundamente los beneficios que ofrece delegar la gestión del acceso y las identidades en un framework consolidado. Durante la etapa en PHP nativo (semana 4), la construcción de un módulo de autenticación seguro obligaba a programar a mano el hashing de claves mediante `password_hash()`, el control de tokens anti-CSRF, la persistencia de datos de sesión y la prevención ante intentos reiterados de intrusión, entre muchos otros aspectos.

Django abstrae dicha complejidad sin sacrificar flexibilidad ni control para el desarrollador. Su motor de autenticación adopta el algoritmo **PBKDF2** emparejado con SHA256 como estándar por defecto para el cifrado de contraseñas, ejecutando miles de iteraciones destinadas a frustrar ataques de fuerza bruta, librando al programador de gestionar estos detalles criptográficos manualmente.

Asimismo, el concepto de **Middleware como arquitectura de capas transversales** constituyó uno de los hallazgos más potentes del tema. Esta abstracción brinda un enfoque elegante para solventar requisitos transversales a todas las solicitudes de la aplicación (autenticación global, registro de auditoría/logging, políticas CORS o compresión de recursos) sin sobrecargar la lógica de negocio individual en cada vista.

En mi formación como futuro ingeniero de sistemas, comprender que la **seguridad informática debe estructurarse mediante capas defensivas múltiples** (encabezados de seguridad HTTP a nivel de middleware, mecanismos de protección CSRF, autenticación de identidades y permisos por objeto) y no como un añadido superficial al finalizar el proyecto, constituye un principio fundamental que orientará mis desarrollos futuros.
