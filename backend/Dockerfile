FROM python:3.11-slim

WORKDIR /code

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/code
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Script para asegurar que la DB esté lista, migrada y con datos
# Intentamos correr migraciones, si falla (porque no hay), el script de seed creará las tablas.
CMD ["sh", "-c", "sleep 5 && (alembic upgrade head || echo 'No migrations found, relying on sync models') && python -m app.seed_demo && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]