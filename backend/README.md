# SmartFood AI Backend

Backend de alto rendimiento construido con **FastAPI**, **SQLAlchemy 2.0** (Async) y **PostgreSQL**.

## Requisitos
* Python 3.11+
* Docker & Docker Compose (Recomendado para la base de datos)

## Instalación Local

1. Crear un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. Configurar entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales de base de datos
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   uvicorn app.main:app --reload
   ```

## Estructura del Proyecto
* `app/api/`: Rutas y endpoints de la API.
* `app/core/`: Configuración global, seguridad y base de datos.
* `app/models/`: Modelos de base de datos (SQLAlchemy).
* `app/schemas/`: Esquemas de validación y serialización (Pydantic).
* `app/services/`: Lógica de negocio reusable.
* `app/repositories/`: Capa de acceso a datos.

## Docker
Puedes construir y ejecutar el backend usando el Dockerfile proporcionado:
```bash
docker build -t smartfood-backend .
docker run -p 8000:8000 smartfood-backend
```
