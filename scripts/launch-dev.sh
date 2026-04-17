#!/bin/bash

# Prepare Development Environment for SmartFood AI (Mac/Linux/Windows Bash)

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

DB_USER=${POSTGRES_USER:-postgres}
DB_NAME=${POSTGRES_DB:-smartfood}

echo -e "\033[0;36m\n🚀 Iniciando entorno de desarrollo (Docker)...\033[0m"

# 1. Start Database Service
echo -e "\n[1/4] Levantando base de datos..."
docker compose -f docker-compose.dev.yml up -d db

# 2. Wait for Postgres to be ready
echo -e "\n[2/4] Esperando a que el motor de base de datos esté listo..."
retries=10
while [ $retries -gt 0 ]; do
    if docker exec smartfood_db_dev pg_isready -U $DB_USER | grep -q "accepting connections"; then
        echo -e "\033[0;32m✅ Base de datos lista para recibir conexiones.\033[0m"
        break
    fi
    echo "..."
    ((retries--))
    sleep 3
done

if [ $retries -eq 0 ]; then
    echo -e "\033[0;31m❌ Error: La base de datos no respondió a tiempo.\033[0m"
    exit 1
fi

# 3. Create Schema and Seed data
echo -e "\n[3/4] Ejecutando esquema y semillas (SQL)..."
docker exec -i smartfood_db_dev psql -U $DB_USER -d $DB_NAME < backend/db/sql/schema.sql > /dev/null
docker exec -i smartfood_db_dev psql -U $DB_USER -d $DB_NAME < backend/db/sql/seed_data.sql > /dev/null
echo -e "\033[0;32m✅ Base de datos inicializada correctamente.\033[0m"

# 4. Start Application Services
echo -e "\n[4/4] Levantando Backend y Frontend..."
docker compose -f docker-compose.dev.yml up -d

echo -e "\033[0;32m\n✨ ¡ENTORNO LISTO!\033[0m"
echo "----------------------------------"
echo "🖥️  Frontend: http://localhost:3000"
echo "⚙️  Backend:  http://localhost:8000/docs"
echo "📊 pgAdmin:  http://localhost:5050 (admin@smartfood.ai / admin)"
echo "----------------------------------\n"
