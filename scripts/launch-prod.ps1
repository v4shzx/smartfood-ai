# SmartFood AI - Production Deployment Script
# Construye imagenes, aplica migraciones y despliega en produccion

Write-Host ""
Write-Host "[SMARTFOOD] Iniciando despliegue de PRODUCCION..." -ForegroundColor Magenta

# 1. Validate .env
if (-not (Test-Path ".env")) {
    Write-Host "[WARN] No se encontro .env. Se usaran valores por defecto." -ForegroundColor Yellow
}

# 2. Build and Up
Write-Host ""
Write-Host "[1/3] Construyendo imagenes y levantando contenedores..." -ForegroundColor Gray
docker-compose -f docker-compose.yml up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Fallo al levantar los contenedores." -ForegroundColor Red
    exit 1
}

# 3. Run Alembic Migrations
Write-Host ""
Write-Host "[2/3] Aplicando migraciones de base de datos (Alembic)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker exec smartfood_backend alembic upgrade head

if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Las migraciones no se aplicaron. Verifica que el backend este activo." -ForegroundColor Yellow
} else {
    Write-Host "[OK] Migraciones completadas." -ForegroundColor Green
}

# 4. Cleanup
Write-Host ""
Write-Host "[3/3] Limpiando imagenes antiguas..." -ForegroundColor Gray
docker image prune -f

Write-Host ""
Write-Host "=================================="
Write-Host " DESPLIEGUE COMPLETADO"
Write-Host "=================================="
Write-Host " App      : http://localhost:3000"
Write-Host " API Docs : http://localhost:8000/docs"
Write-Host "=================================="
Write-Host ""
