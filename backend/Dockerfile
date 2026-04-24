FROM python:3.11-slim

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    make \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt

COPY . .

ENV PYTHONPATH=/code

EXPOSE 8000

# Script para asegurar que la DB esté lista y arrancar el servidor
CMD ["sh", "-c", "sleep 2 && (alembic upgrade head || echo 'No migrations needed') && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
