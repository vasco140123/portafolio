# Semana 10: Introducción a Python: Tipos, Colecciones, Funciones y POO

**Estudiante:** Vasco Qori Ramos Mercado
**Curso:** Desarrollo de Aplicaciones Web
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)
**Carrera:** Ingeniería de Sistemas
**Período:** 09 de junio – 13 de junio de 2026
**Herramientas:** Python 3.x, pip, venv

---

## 1. Introducción a Python

**Python** constituye un lenguaje de programación de **propósito general**, concebido por Guido van Rossum y lanzado en 1991. A diferencia de PHP, cuyo diseño inicial se centró en la producción web, Python fue ideado como un entorno multipropósito: abarca desde el desarrollo web y la ciencia de datos hasta la inteligencia artificial, la automatización de procesos, el scripting y la creación de software de escritorio.

### Características Fundamentales

- **Interpretado:** Python prescinde de la compilación a código máquina nativo; en su lugar, un intérprete procesa y ejecuta la lógica línea a línea. Esto favorece la experimentación interactiva mediante la consola interactiva (REPL).
- **Tipado dinámico:** Al igual que en PHP, la definición de los tipos de datos ocurre en tiempo de ejecución. No obstante, a partir de Python 3.5 se introdujeron los **type hints** (anotaciones de tipo) para mejorar la documentación y el análisis estático.
- **Enfoque en la legibilidad:** La filosofía de construcción de Python sitúa la claridad del código como prioridad fundamental. Van Rossum defendió la premisa de que el código suele leerse con mayor frecuencia de la que se redacta.
- **Indentación sintáctica:** A diferencia del uso de `{}` habitual en PHP, Python emplea la **indentación** (espacios o tabulaciones) para delimitar los bloques lógicos. Este aspecto resulta obligatorio y forma parte directa de la sintaxis del lenguaje.
- **Baterías incluidas (Batteries included):** La biblioteca estándar del lenguaje destaca por ser sumamente amplia, ofreciendo módulos nativos para interactuar con HTTP, JSON, motores de bases de datos, expresiones regulares, compresión y correo electrónico, entre otros.

### Configuración del Entorno

```bash
# Comprobar la versión instalada de Python
python --version
# Python 3.12.x

# Generar un entorno virtual aislado para el proyecto
python -m venv entorno

# Habilitar el entorno virtual (Windows)
entorno\Scripts\activate

# Habilitar el entorno virtual (Linux/Mac)
source entorno/bin/activate

# Descargar e instalar librerías en el entorno
pip install requests flask django

# Exportar el listado de dependencias del proyecto
pip freeze > requirements.txt

# Instalar los paquetes registrados en el archivo
pip install -r requirements.txt
```

El **entorno virtual** (`venv`) cumple un rol análogo a la carpeta `vendor/` en Composer: aísla las librerías propias del proyecto respecto al entorno global del sistema, previniendo incompatibilidades entre versiones de distintas aplicaciones.

---

## 2. Tipos de Datos en Python

Python posee un conjunto de tipos de datos flexible y altamente expresivo. Mediante la función nativa `type()`, es posible inspeccionar el tipo asociado a cualquier variable durante la ejecución:

```python
# Tipos primitivos y escalares en Python
entero   = 42            # int
decimal  = 3.14159       # float
texto    = "Hola, Perú"  # str
booleano = True          # bool (True / False, iniciando en mayúscula)
nulo     = None          # NoneType (equivalente a null en PHP)

print(type(entero))   # <class 'int'>
print(type(texto))    # <class 'str'>
print(type(booleano)) # <class 'bool'>
print(type(nulo))     # <class 'NoneType'>

# Anotaciones de tipo (type hints desde Python 3.5+)
def saludar(nombre: str, veces: int = 1) -> str:
    return f"Hola, {nombre}! " * veces
```

### Particularidades de Python vs PHP

| Característica | PHP | Python |
|---|---|---|
| Valor nulo | `null` | `None` |
| Booleanos | `true`, `false` | `True`, `False` |
| Concatenación | `.` (punto) | `+` o f-strings |
| División entera | `intdiv()` | `//` |
| Exponente | `**` | `**` |
| Cadenas (Strings) | `"` o `'` equivalentes | `"` o `'` equivalentes, más `"""` para multilínea |

---

## 3. Listas, Tuplas y Diccionarios

Las colecciones representan estructuras encargadas de agrupar múltiples elementos. Python incorpora cuatro tipos principales de estructuras de datos coleccionables, ofreciendo propiedades específicas en cada caso:

```python
# =============================
# LISTA: estructura MUTABLE, ORDENADA, admite valores duplicados
# Análoga a los arreglos indexados tradicionales de PHP
# =============================
materias = ["Desarrollo Web", "Base de Datos", "Algoritmos", "Redes"]

materias.append("Sistemas Operativos")   # Insertar al final
materias.insert(0, "Cálculo")            # Insertar en el índice 0
materias.remove("Redes")                  # Eliminar buscando el valor
print(materias[1])                         # Lectura por posición: "Base de Datos"
print(materias[-1])                        # Acceso al último elemento: "Sistemas Operativos"
print(materias[1:3])                       # Slicing / Rebanado: ["Base de Datos", "Algoritmos"]
print(len(materias))                       # Conteo total: 5

# =============================
# TUPLA: estructura INMUTABLE, ORDENADA, admite valores duplicados
# Recomendada para almacenar conjuntos fijos (p. ej., coordenadas o valores RGB)
# =============================
coordenadas_huancayo = (-12.0653, -75.2049)  # Latitud, Longitud
rgb_verde = (0, 255, 0)

# coordenadas_huancayo[0] = -11.0  # ❌ TypeError: 'tuple' object does not support item assignment
latitud, longitud = coordenadas_huancayo   # Desempaquetado (unpacking)
print(f"Latitud: {latitud}, Longitud: {longitud}")

# =============================
# DICCIONARIO: estructura MUTABLE, ORDENADA (Python 3.7+), pares clave-valor ÚNICOS
# Análogo a los arreglos asociativos de PHP
# =============================
estudiante = {
    "nombre"    : "Vasco Qori Ramos Mercado",
    "codigo"    : "2023-1045",
    "carrera"   : "Ingeniería de Sistemas",
    "universidad": "UNCP",
    "promedio"  : 14.5,
    "activo"    : True,
    "materias"  : ["Desarrollo Web", "BD", "Algoritmos"]  # Puede contener listas
}

print(estudiante["nombre"])              # "Vasco Qori Ramos Mercado"
print(estudiante.get("edad", "N/A"))     # "N/A" — get() previene excepciones del tipo KeyError
estudiante["semestre"] = "2026-I"        # Registrar una nueva clave
del estudiante["activo"]                 # Remover clave existente

# Recorrido de los elementos del diccionario
for clave, valor in estudiante.items():
    print(f"  {clave}: {valor}")

# =============================
# SET (CONJUNTO): estructura MUTABLE, NO ORDENADA, sin elementos repetidos
# Ideal para realizar operaciones matemáticas de conjuntos (uniones, intersecciones)
# =============================
notas_unicas = {15, 18, 12, 15, 20, 18}
print(notas_unicas)  # {12, 15, 18, 20} — filtrado automático de duplicados
```

---

## 4. Condicionales y Estructuras de Control

```python
# Evaluaciones condicionales if / elif / else
promedio = 14.5

if promedio >= 17:
    calificacion = "Excelente"
elif promedio >= 14:
    calificacion = "Bueno"
elif promedio >= 11:
    calificacion = "Regular"
else:
    calificacion = "Desaprobado"

print(f"Calificación: {calificacion}")  # "Bueno"

# Expresión ternaria (evaluación condicional simplificada en una línea)
estado = "Aprobado" if promedio >= 11 else "Desaprobado"

# Iteración mediante bucle for — recorre cualquier elemento iterable
materias = ["Desarrollo Web", "Base de Datos", "Algoritmos"]
for i, materia in enumerate(materias, start=1):
    print(f"{i}. {materia}")

# Iteración con bucle while
intentos = 0
while intentos < 3:
    print(f"Intento {intentos + 1}")
    intentos += 1

# Comprensión de listas (List Comprehension) — técnica idiomática para construir listas
notas = [12, 15, 18, 10, 16, 20, 8]
aprobados = [nota for nota in notas if nota >= 11]  # [12, 15, 18, 16, 20]
notas_dobles = [nota * 2 for nota in notas]          # Duplicación de calificaciones

# Comprensión de diccionarios
cuadrados = {n: n**2 for n in range(1, 6)}  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

---

## 5. Funciones en Python

Dentro del ecosistema de Python, las funciones son tratadas como **elementos de primera clase**: pueden almacenarse en variables, transferirse en calidad de argumentos y devolverse como resultado de otros procedimientos.

```python
# Definición de función con anotación de argumentos y retorno múltiple
def calcular_estadisticas(notas: list[float]) -> tuple[float, float, float]:
    """
    Determina el promedio, la calificación mínima y la máxima a partir de un listado.
    
    Args:
        notas: Colección de valores numéricos correspondiente a calificaciones.
    
    Returns:
        Tupla estructurada con (promedio, mínima, máxima).
    """
    if not notas:
        return 0.0, 0.0, 0.0
    
    media  = sum(notas) / len(notas)
    minima = min(notas)
    maxima = max(notas)
    return media, minima, maxima  # Devolución de múltiples datos en una tupla

# Desestructuración de valores devueltos
media, minima, maxima = calcular_estadisticas([12, 15, 18, 10, 16])
print(f"Media: {media:.2f}, Mínima: {minima}, Máxima: {maxima}")

# *args: recepción de cantidad variable de argumentos posicionales
def sumar(*args: float) -> float:
    return sum(args)

print(sumar(1, 2, 3, 4, 5))  # 15.0

# **kwargs: recepción de cantidad variable de argumentos nombrados
def crear_perfil(nombre: str, **kwargs) -> dict:
    perfil = {"nombre": nombre}
    perfil.update(kwargs)
    return perfil

perfil = crear_perfil("Vasco", edad=21, ciudad="Huancayo", carrera="Sistemas")
# {"nombre": "Vasco", "edad": 21, "ciudad": "Huancayo", "carrera": "Sistemas"}
```

---

## 6. Programación Orientada a Objetos en Python

```python
from abc import ABC, abstractmethod
from datetime import datetime

# Clase principal abstracta
class Persona(ABC):
    def __init__(self, nombre: str, dni: str) -> None:
        self._nombre = nombre  # _ señala convención de atributo protegido
        self.__dni   = dni     # __ aplica name mangling para simular privacidad
        self._creado_en = datetime.now()

    @property
    def nombre(self) -> str:
        return self._nombre

    @property
    def dni(self) -> str:
        return self.__dni  # Lectura controlada mediante propiedad

    @abstractmethod
    def presentarse(self) -> str:
        """Método abstracto: implementación obligatoria en clases derivadas."""
        pass

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(nombre='{self._nombre}')"


# Clase derivada que hereda de Persona
class Estudiante(Persona):
    def __init__(self, nombre: str, dni: str, codigo: str) -> None:
        super().__init__(nombre, dni)  # Inicialización de la clase base
        self.__codigo   = codigo
        self.__materias: list[str] = []

    def matricular(self, materia: str) -> None:
        if materia not in self.__materias:
            self.__materias.append(materia)

    def presentarse(self) -> str:
        return (f"Soy {self._nombre}, alumno con código {self.__codigo}. "
                f"Tengo inscripción en {len(self.__materias)} asignatura(s).")

    @classmethod
    def crear_desde_dict(cls, datos: dict) -> 'Estudiante':
        """Constructor secundario mediante método de fábrica."""
        return cls(datos['nombre'], datos['dni'], datos['codigo'])


# Ejemplo de ejecución
vasco = Estudiante("Vasco Ramos", "75430218", "2023-1045")
vasco.matricular("Desarrollo Web")
vasco.matricular("Base de Datos")
print(vasco.presentarse())
print(repr(vasco))
```

---

## 7. Excepciones y Módulos

```python
# Control de errores mediante estructura try / except / finally
import json
import os

def leer_configuracion(ruta: str) -> dict:
    """Realiza el procesamiento de un archivo JSON resguardando posibles fallos."""
    try:
        with open(ruta, 'r', encoding='utf-8') as archivo:
            return json.load(archivo)
    except FileNotFoundError:
        print(f"❌ No se encontró el archivo indicado: {ruta}")
        return {}
    except json.JSONDecodeError as e:
        print(f"❌ Estructura JSON defectuosa: {e}")
        return {}
    except PermissionError:
        print(f"❌ Permisos insuficientes para acceder a: {ruta}")
        return {}
    finally:
        print("✅ Operación de lectura concluida.")  # Ejecución garantizada

# Definición de una excepción a medida
class SaldoInsuficienteError(ValueError):
    def __init__(self, saldo_actual: float, monto_solicitado: float) -> None:
        self.saldo_actual      = saldo_actual
        self.monto_solicitado  = monto_solicitado
        super().__init__(
            f"Fondos insuficientes: dispone de S/ {saldo_actual:.2f} "
            f"pero intenta retirar S/ {monto_solicitado:.2f}"
        )

# Importación y gestión de módulos
import math           # Módulo estándar nativo
from datetime import date, timedelta  # Importación de elementos específicos
import os.path as osp  # Asignación de alias a un módulo
```

---

## 8. Reflexión Personal: Python vs JavaScript

Abordar el estudio de Python tras varios meses trabajando activamente con PHP supuso una vivencia sumamente enriquecedora y fresca, aunque guiada por fundamentos conocidos. El proceso adaptativo transcurrió de forma natural: conceptos esenciales como el manejo de variables, la declaración de funciones, los ciclos repetitivos, la POO y la gestión de excepciones son universales; las divergencias centrales radican en la sintaxis empleada y el enfoque del lenguaje.

El rasgo más impactante de Python reside en su **marcado énfasis en la legibilidad y la pulcritud**. El documento conceptual conocido como El Zen de Python, accesible al ejecutar `import this`, sintetiza este pensamiento: "Lo bello es preferible a lo feo. Lo explícito es preferible a lo implícito. Lo simple es preferible a lo complejo."

En comparación con JavaScript (con el que ya había interactuado en el ámbito frontend), Python proyecta un carácter más **estructurado y riguroso**: la sangría obligatoria previene inconsistencias en la organización del código; las f-strings ofrecen una sintaxis más limpia frente a los template literals cuando las expresiones se tornan elaboradas; y la ausencia de llaves `{}` otorga a los programas una fluidez semejante a la lectura de texto narrativo.

Un punto verdaderamente motivador consistió en asimilar que Python representa la **vía principal de acceso a la Inteligencia Artificial y al Aprendizaje Automático**. Herramientas y bibliotecas como NumPy, Pandas, TensorFlow y scikit-learn gozan de un posicionamiento estelar en la industria tecnológica global. En mi condición de estudiante de ingeniería de sistemas en Huancayo, dominar estas competencias en Python habilita oportunidades estratégicas dentro de sectores clave como la minería, el sector agrícola y la gestión pública, los cuales demandan progresivamente análisis avanzado de datos en sus operaciones cotidianas.
