#!/bin/bash

# Production Deployment Script for SmartFood AI (Mac/Linux/Windows Bash)

echo -e "\033[0;35m\n🚀 Iniciando despliegue de PRODUCCIÓN...\033[0m"

# 1. Validation
if [ ! -f ".env" ]; then
    echo -e "\033[0;33m⚠️ Advertencia: No se encontró el archivo .env. Se usarán valores por defecto.\033[0m"
fi

# 2. Build and Up
echo -e "\n[1/3] Construyendo imágenes y levantando contenedores..."
docker compose up -d --build

# 3. Run Migrations
echo -e "\n[2/3] Aplicando migraciones de base de datos (Alembic)..."
sleep 5 # Give backend time to start
docker exec smartfood_backend alembic upgrade head
echo -e "\033[0;32m✅ Migraciones completadas.\033[0m"

# 4. Cleanup
echo -e "\n[3/3] Limpiando imágenes antiguas/huérfanas..."
docker image prune -f

echo -e "\033[0;32m\n🌟 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!\033[0m"
echo "----------------------------------"
echo "🌍 App:     http://localhost:3000"
echo "🛠️  API Docs: http://localhost:8000/docs"
echo "----------------------------------\n"
