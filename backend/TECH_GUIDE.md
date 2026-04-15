# Guía de Tecnologías y Uso: Backend

Este documento detalla las tecnologías utilizadas en el servidor de SmartFood AI y cómo interactuar con ellas.

## Stack Tecnológico

1.  **FastAPI (Python 3.11+)**: Framework web moderno de alto rendimiento basado en tipado de Python.
2.  **SQLAlchemy 2.0 (Async)**: Toolkit de SQL y mapeador objeto-relacional (ORM) configurado para operaciones asíncronas.
3.  **Pydantic V2**: Validación de datos y gestión de configuraciones mediante modelos de tipado.
4.  **Uvicorn**: Servidor ASGI de alta velocidad para ejecutar la aplicación.
5.  **Alembic**: Herramienta de migraciones para la base de datos.
6.  **JWT (python-jose)**: Implementación de JSON Web Tokens para seguridad y autenticación.

## Guía de Uso

### 1. Iniciar el Servidor de Desarrollo
Asegúrate de tener un entorno virtual activo y las dependencias instaladas:
```bash
cd backend
uvicorn app.main:app --reload
```
Acceso a la documentación interactiva:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Estructura de código
- `/app/api`: Define las rutas. Cada versión tiene su propia carpeta (ej. `/v1`).
- `/app/models`: Clases de SQLAlchemy que representan las tablas de la BD.
- `/app/schemas`: Modelos de Pydantic para validar lo que entra y sale de la API.
- `/app/core`: Configuraciones globales y seguridad.

### 3. Variables de Entorno
Copia el archivo `.env.example` a `.env` y ajusta los valores según tu entorno local. No compartas nunca el archivo `.env` en repositorios públicos.
