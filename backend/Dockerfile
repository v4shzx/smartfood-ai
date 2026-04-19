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
# Añadimos un chequeo de archivos para depuración en el log
CMD ["sh", "-c", "ls -R /code/app && alembic upgrade head && python -m app.seed_demo && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]