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

# Script para asegurar que la DB esté lista y arrancar el servidor
CMD ["sh", "-c", "sleep 2 && (alembic upgrade head || echo 'No migrations needed') && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]