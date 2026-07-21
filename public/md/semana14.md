# Semana 14: Arquitectura de Microservicios, Contenedores Docker y Orquestación Mediante Kubernetes

**Estudiante:** Vasco Qori Ramos Mercado  
**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Carrera:** Ingeniería de Sistemas  
**Período:** 07 de julio – 11 de julio de 2026  
**Herramientas:** Docker, docker-compose, Kubernetes  

---

## 1. Comparativa: Arquitectura Monolítica frente a Microservicios

### Estructura Monolítica

Un **sistema monolítico** agrupa y empaqueta la totalidad de los módulos del negocio (como autenticación de usuarios, catálogo de artículos, órdenes de compra, pasarelas de pago, notificaciones y reportes) dentro de un **único bloque ejecutable**. Esta modalidad representa el diseño predeterminado en entornos como Django, Laravel y la gran mayoría de frameworks tradicionales.

**Beneficios del Enfoque Monolítico:**
- Simplicidad durante las fases de desarrollo y depuración de errores.
- Comprensión sencilla por parte de equipos de trabajo reducidos.
- Ausencia de latencia de red en la comunicación inter-módulo.
- Gestión fluida y natural de transacciones ACID.

**Inconvenientes del Monolito (en escenarios de alto volumen):**
- Una falla crítica en un módulo individual puede inhabilitar la totalidad del sistema.
- El despliegue de cualquier pequeña modificación exige la redistribución completa de la aplicación.
- El escalamiento demanda la réplica total de la infraestructura, sin poder aislar los módulos con mayor carga.
- Grupos de desarrollo numerosos sufren bloqueos al operar sobre el mismo código base.

### Estructura basada en Microservicios

El paradigma de **microservicios** descompone el sistema en **módulos reducidos, independientes y capaces de desplegarse de forma autónoma**, donde cada uno asume la responsabilidad de una función de negocio específica:

```
Arquitectura Monolítica:          Arquitectura de Microservicios:
┌────────────────────────┐        ┌──────────┐  ┌──────────┐
│  Aplicación Django     │        │  Servicio │  │  Servicio│
│  ┌──────────────────┐  │        │  Auth     │  │ Productos│
│  │  Autenticación   │  │        └────┬─────┘  └────┬─────┘
│  │  Productos        │  │             │              │
│  │  Pedidos          │  │        ┌────▼─────┐  ┌────▼─────┐
│  │  Pagos            │  │        │  Servicio │  │  Servicio│
│  │  Notificaciones   │  │        │  Pedidos  │  │   Pagos  │
│  └──────────────────┘  │        └──────────┘  └──────────┘
└────────────────────────┘
```

**Ventajas Organizacionales y Técnicas de los Microservicios:**
- **Escalamiento Selectivo:** Si el componente "Catálogo" experimenta alta demanda, es posible escalar exclusivamente dicha unidad.
- **Resiliencia:** Una caída en el módulo "Notificaciones" no interrumpe el funcionamiento de "Pedidos".
- **Flexibilidad Tecnológica:** Cada microservicio puede implementarse con el lenguaje y motor de base de datos más conveniente para su propósito.
- **Despliegue Autónomo:** Los equipos de desarrollo pueden publicar actualizaciones sin requerir sincronización global con el resto de componentes.
- **Autonomía de Equipos:** Cada grupo se responsabiliza completamente de su microservicio de principio a fin.

---

## 2. Implementación de Patrón API Gateway

En esquemas de microservicios, las aplicaciones cliente (navegadores o apps móviles) no deben conocer las ubicaciones de red internas de cada servicio. El **API Gateway** asume el rol de **único punto de acceso centralizado** para los clientes externos:

```
Cliente Externo
    │
    ▼
┌─────────────────────────────────────┐
│          API Gateway                 │
│  (Nginx / Kong / AWS API Gateway)   │
│                                     │
│  • Enrutamiento de peticiones        │
│  • Autenticación centralizada (JWT) │
│  • Rate limiting                    │
│  • SSL termination                  │
│  • Balanceo de carga               │
│  • Logging y monitoreo centralizado │
└──┬──────────┬──────────┬────────────┘
   │          │          │
   ▼          ▼          ▼
Servicio   Servicio   Servicio
Auth       Productos  Pedidos
(Django)   (FastAPI)  (Node.js)
   │          │          │
   ▼          ▼          ▼
  MySQL    PostgreSQL  MongoDB
```

---

## 3. Estrategias de Comunicación Inter-Servicio

Los microservicios requieren intercambiar información entre sí. Para ello existen dos enfoques predominantes:

### Enfoque Síncrono (REST/HTTP o gRPC)

El servicio emisor detiene su ejecución a la espera de una respuesta. Aunque destaca por su sencillez, puede provocar acoplamiento temporal (si el microservicio receptor no está operativo, el emisor fallará):

```
Servicio Pedidos ──[HTTP POST]──► Servicio Pagos
                ◄──[HTTP 200]──── (espera la respuesta)
```

**Casos de uso recomendados:** Transacciones que exigen respuesta inmediata (como verificar disponibilidad de inventario antes de registrar una orden).

### Enfoque Asíncrono (Gestor de Mensajería)

Los componentes se comunican utilizando agentes o colas de mensajes (tales como RabbitMQ o Apache Kafka). El servicio productor publica el evento en la cola y prosigue sin bloquearse. El servicio consumidor procesa dicho evento conforme disponga de recursos:

```
Servicio Pedidos ──[Publica evento]──► Cola RabbitMQ
                                             │
                          ┌──────────────────┤
                          ▼                  ▼
                Servicio Email         Servicio SMS
              (procesa el evento)   (procesa el evento)
```

**Casos de uso recomendados:** Envío de notificaciones, tareas en segundo plano o transmisión de eventos que conciernen a múltiples microservicios.

---

## 4. Virtualización Liviana mediante Contenedores Docker

**Docker** es una tecnología orientada a empaquetar una aplicación junto con sus elementos indispensables (código, runtime, librerías y configuraciones) en una unidad estandarizada denominada **contenedor**. Dichos contenedores destacan por ser livianos, altamente portables y garantizan un entorno ejecutable idéntico en cualquier infraestructura.

### Fundamentos y Conceptos Clave

| Concepto | Descripción | Analogía |
|---|---|---|
| **Imagen** | Plantilla inmutable que integra la aplicación y sus dependencias | Molde o plantilla de fabricación |
| **Contenedor** | Instancia activa en ejecución derivada de una imagen | Producto o pieza fabricada |
| **Dockerfile** | Conjunto de instrucciones estructuradas para construir una imagen | Receta detallada |
| **Registry** | Almacén central de imágenes de contenedores (Docker Hub, ghcr.io) | Catálogo de soluciones |
| **Volume** | Almacenamiento persistente vinculado al contenedor | Unidad de disco externo |
| **Network** | Red virtual configurada para interconectar contenedores | Red de área local (LAN) |

### Configuración de Dockerfile para una Aplicación Django

```dockerfile
# Dockerfile
# Imagen oficial de Python en versión slim para optimizar espacio
FROM python:3.12-slim

# Definición de variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE=1  # Evitar generación de archivos .pyc
ENV PYTHONUNBUFFERED=1         # Emisión de logs en tiempo real

# Establecimiento del directorio de trabajo interno
WORKDIR /app

# Instalación de paquetes de sistema requeridos
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Instalación previa de dependencias Python para optimizar la caché
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Transferencia del código fuente
COPY . .

# Recopilación de recursos estáticos
RUN python manage.py collectstatic --noinput

# Declaración del puerto expuesto
EXPOSE 8000

# Instrucción por defecto al arrancar el contenedor
CMD ["gunicorn", "portafolio_uncp.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--timeout", "120"]
```

### Gestión y Orquestación Local mediante docker-compose.yml

**Docker Compose** facilita la definición y administración de entornos multi-contenedor empleando una única especificación YAML. Resulta idóneo para entornos de desarrollo local:

```yaml
# docker-compose.yml
version: '3.9'

services:

  # ─── Servicio 1: Base de datos PostgreSQL ───────────────────────────────
  db:
    image: postgres:16-alpine
    container_name: portafolio_db
    restart: unless-stopped
    environment:
      POSTGRES_DB:       portafolio_uncp
      POSTGRES_USER:     vasco
      POSTGRES_PASSWORD: secreto_local_123
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Almacenamiento persistente
    ports:
      - "5432:5432"  # Puerto abierto para administración externa
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vasco -d portafolio_uncp"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─── Servicio 2: Aplicación Django ──────────────────────────────────────
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: portafolio_web
    restart: unless-stopped
    command: >
      sh -c "python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"
    volumes:
      - .:/app                    # Recarga automática de código fuente
      - static_files:/app/staticfiles
      - media_files:/app/media
    ports:
      - "8000:8000"
    environment:
      DEBUG:            "True"
      DATABASE_URL:     "postgresql://vasco:secreto_local_123@db:5432/portafolio_uncp"
      SECRET_KEY:       "django-dev-key-no-usar-en-produccion"
      ALLOWED_HOSTS:    "localhost,127.0.0.1"
    depends_on:
      db:
        condition: service_healthy  # Espera a la inicialización de la base de datos

  # ─── Servicio 3: Cache Redis ─────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: portafolio_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes  # Persistencia AOF
volumes:
  postgres_data:   # Volumen designado (se conserva entre reinicios)
  static_files:
  media_files:
```

### Comandos Clave en Docker Compose

```bash
# Construir imágenes y arrancar todos los servicios (modo interactivo)
docker compose up --build

# Iniciar servicios en segundo plano (modo desatendido)
docker compose up -d

# Consultar logs de un servicio determinado
docker compose logs -f web

# Ejecutar instrucciones dentro del contenedor activo
docker compose exec web python manage.py createsuperuser
docker compose exec web python manage.py shell

# Detener y desmantelar contenedores (manteniendo volúmenes)
docker compose down

# Eliminar contenedores y volúmenes (️ elimina los datos guardados)
docker compose down -v
```

---

## 5. Orquestación de Contenedores con Kubernetes

**Kubernetes (K8s)** es la plataforma open-source líder a nivel industrial para la orquestación de contenedores. Si bien Docker Compose destaca en entornos de desarrollo local, Kubernetes se concibió con el propósito de **administrar sistemas distribuidos en producción a gran escala**.

### Elementos Esenciales de Kubernetes

| Concepto | Descripción |
|---|---|
| **Pod** | Menor unidad de despliegue en K8s. Agrupa uno o más contenedores que comparten almacenamiento y red. |
| **Deployment** | Administra la creación, actualización y réplicas de los Pods. |
| **Service** | Expone un grupo de Pods como un punto de acceso a la red persistente y estable. |
| **Ingress** | Gestiona el tráfico entrante HTTP/HTTPS desde el exterior hacia los Services del clúster. |
| **ConfigMap** | Almacena parámetros de configuración en formato clave-valor sin datos sensibles. |
| **Secret** | Objeto destinado a resguardar datos confidenciales (claves, tokens) de forma cifrada. |
| **PersistentVolumeClaim** | Solicitud formal de almacenamiento persistente para los Pods. |
| **HPA** | Horizontal Pod Autoscaler: ajusta de forma dinámica la cantidad de Pods según la carga. |

### Definiciones Declarativas en Archivos YAML

```yaml
# kubernetes/deployment-web.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portafolio-web
  labels:
    app: portafolio
    tier: backend
spec:
  replicas: 3           # Despliegue de 3 instancias del contenedor Django
  selector:
    matchLabels:
      app: portafolio
      tier: backend
  template:
    metadata:
      labels:
        app: portafolio
        tier: backend
    spec:
      containers:
        - name: django-app
          image: ghcr.io/vascoqori/portafolio:latest
          ports:
            - containerPort: 8000
          envFrom:
            - configMapRef:
                name: portafolio-config
            - secretRef:
                name: portafolio-secrets
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health/
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health/
              port: 8000
            initialDelaySeconds: 15
            periodSeconds: 5
```

---

## 6. Mecanismos de Seguridad, Monitoreo y Escalado

### Autenticación Stateless basada en JWT (JSON Web Tokens)

En la arquitectura de microservicios, **JWT** constituye la solución preferida para implementar la autenticación sin estado (stateless):

```
1. Usuario solicita autenticación → API Gateway convalida las credenciales
2. Gateway expide un JWT firmado mediante una clave secreta
3. Cliente adjunta el JWT en cada petición: Authorization: Bearer <token>
4. Cada microservicio convalida la firma del JWT de forma autónoma
   (sin consultar un servidor central de sesiones)
```

### Monitoreo Operativo empleando Prometheus y Grafana

```yaml
# Configuración básica para captura de métricas en Prometheus
scrape_configs:
  - job_name: 'django-app'
    scrape_interval: 15s
    static_configs:
      - targets: ['portafolio-web:8000']
    metrics_path: '/metrics'
```

**Prometheus** recopila datos y métricas de desempeño de las aplicaciones (volumen de peticiones, tiempos de respuesta, consumo de memoria y tasa de errores), mientras que **Grafana** se encarga de representar dicha información en paneles visuales interactivos en tiempo real.

### Autoescalado Horizontal de Pods (HPA)

```yaml
# kubernetes/hpa-web.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: portafolio-web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: portafolio-web
  minReplicas: 2       # Mantener un mínimo de 2 instancias activas
  maxReplicas: 10      # Permitir el escalado de hasta 10 instancias ante picos de demanda
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70  # Incrementar pods si el uso promedio de CPU excede el 70%
```

---

## 7. Valoración Personal sobre el Modelo de Microservicios

La semana 14 representó el reto de mayor complejidad técnica a lo largo de la asignatura. Las herramientas Docker y Kubernetes introducen un nivel de abstracción radicalmente distinto: el enfoque cambia desde la programación directa del software hacia la **infraestructura como código** (*Infrastructure as Code*).

El aprendizaje de mayor valor acumulado no radicó en dominar la sintaxis de la configuración en YAML, sino en adoptar un **cambio de paradigma mental**: bajo el modelo de contenedores, la infraestructura se considera volátil y sustituible. Los entornos se declaran por escrito en lugar de ajustarse a mano, estructurando las aplicaciones bajo la premisa de que cualquier componente puede experimentar fallos repentinos.

Una interrogante fundamental que me planteé fue: ¿en qué escenario resulta conveniente migrar a microservicios? La conclusión a la que llegué indica que **raramente debe elegirse en etapas iniciales**. Administrar múltiples servicios independientes, esquemas de red interconectados, bases de datos aisladas y mensajería asíncrona conlleva un elevado costo operativo. Este modelo cobra sentido solo cuando la aplicación monolítica alcanza límites de escala técnica o dificulta la dinámica de trabajo de múltiples equipos.

Desde mi posición como estudiante de la UNCP en Huancayo, el conocimiento práctico más relevante estriba en la adopción de **Docker en el entorno de desarrollo**: la capacidad de definir la infraestructura completa dentro de un archivo `docker-compose.yml` y compartirla con colegas o evaluadores para desplegar el proyecto sin contratiempos de configuración representa una competencia profesional muy valorada en la industria actual.
