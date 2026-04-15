# Guía de Gestión de Base de Datos

SmartFood AI utiliza **PostgreSQL** como motor principal de base de datos, gestionado por **Docker** y **Alembic**.

## Infraestructura (Docker)

La base de datos se levanta utilizando Docker Compose. La configuración incluye:
- **PostgreSQL 15**: El motor de base de datos. Puerto: `5432`.
- **pgAdmin 4**: Interfaz web para gestionar la BD. Puerto: `5050`.

**Comandos útiles:**
- Levantar servicios: `docker-compose up -d`
- Detener servicios: `docker-compose down`
- Ver logs: `docker-compose logs -f db`

## Migraciones (Alembic)

Las migraciones permiten evolucionar el esquema de la base de datos de forma controlada y versionada.

### Generar una nueva migración
Cuando modifiques un modelo en `app/models/`, genera el script de migración:
```bash
python -m alembic revision --autogenerate -m "descripción del cambio"
```

### Aplicar migraciones
Para sincronizar tu base de datos con el código:
```bash
python -m alembic upgrade head
```

### Revertir cambios
Para volver a la versión anterior:
```bash
python -m alembic downgrade -1
```

## Configuración de Conexión
La conexión se gestiona en `app/core/database.py` de forma asíncrona usando `asyncpg`. Los detalles de conexión se obtienen de las variables de entorno:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_SERVER`
- `POSTGRES_DB`
