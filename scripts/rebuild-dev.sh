#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}===> Iniciando limpieza total y reconstrucción...${NC}"

# 1. Detener y eliminar contenedores, redes y VOLÚMENES (-v)
echo -e "${YELLOW}1. Deteniendo servicios y eliminando volúmenes (limpieza de BD)...${NC}"
docker-compose -f docker-compose.dev.yml down -v

# 2. Reconstruir imágenes sin cache para asegurar un estado limpio
echo -e "${YELLOW}2. Reconstruyendo imágenes de Docker...${NC}"
docker-compose -f docker-compose.dev.yml build --no-cache

# 3. Levantar los servicios en segundo plano
echo -e "${YELLOW}3. Levantando servicios...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# 4. Esperar a que el backend esté listo
echo -e "${YELLOW}4. Esperando a que el backend esté disponible...${NC}"
MAX_RETRIES=30
COUNT=0
until $(curl --output /dev/null --silent --head --fail http://localhost:8000/health); do
    if [ $COUNT -eq $MAX_RETRIES ]; then
      echo -e "${RED}Error: El backend no inició a tiempo.${NC}"
      exit 1
    fi
    printf '.'
    sleep 2
    COUNT=$((COUNT+1))
done
echo -e "\n${GREEN}Backend detectado!${NC}"

# 5. Ejecutar el script de semillas para poblar la base de datos limpia
echo -e "${YELLOW}5. Inyectando datos de demostración y personal...${NC}"
docker exec smartfood_backend_dev python -m app.seed_demo

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}   LIMPIEZA Y RECONSTRUCCIÓN COMPLETADA        ${NC}"
echo -e "${GREEN}   Frontend: http://localhost:3000             ${NC}"
echo -e "${GREEN}   Backend:  http://localhost:8000/docs        ${NC}"
echo -e "${GREEN}===============================================${NC}"
