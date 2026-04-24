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

## Railway

Para que `Meta Prophet` quede activo en Railway, el backend debe desplegarse usando el `backend/Dockerfile`.

Este proyecto ya quedó preparado para eso:

- instala compiladores y dependencias del sistema necesarias para paquetes científicos;
- actualiza `pip`, `setuptools` y `wheel` antes de instalar `requirements.txt`;
- instala `prophet` desde `backend/requirements.txt`;
- expone en `/health` si `pandas` y `prophet` quedaron disponibles en runtime.

### Verificación después del deploy

Una vez desplegado en Railway, revisa dos cosas:

1. Logs de arranque del backend.
   Debe aparecer una línea parecida a:
   `AI runtime status | pandas_available=True | prophet_available=True`

2. Endpoint de salud:
   `GET /health`

   Debe devolver algo como:
   ```json
   {
     "status": "healthy",
     "project": "SmartFood AI API",
     "ai_runtime": {
       "pandas_available": true,
       "prophet_available": true
     }
   }
   ```

Si `prophet_available` sale en `false`, Railway construyó el servicio sin esa librería y el endpoint de predicción caerá al fallback heurístico.
