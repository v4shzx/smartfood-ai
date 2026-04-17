# Production Deployment Script for SmartFood AI

Write-Host "`n🚀 Iniciando despliegue de PRODUCCIÓN..." -ForegroundColor Magenta

# 1. Validation
if (-not (Test-Path ".env")) {
    Write-Host "⚠️ Advertencia: No se encontró el archivo .env. Se usarán valores por defecto." -ForegroundColor Yellow
}

# 2. Build and Up
Write-Host "`n[1/3] Construyendo imágenes y levantando contenedores..." -ForegroundColor Gray
docker-compose -f docker-compose.yml up -d --build

# 3. Run Migrations
Write-Host "`n[2/3] Aplicando migraciones de base de datos (Alembic)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5 # Give backend time to start
docker exec smartfood_backend alembic upgrade head
Write-Host "✅ Migraciones completadas." -ForegroundColor Green

# 4. Cleanup
Write-Host "`n[3/4] Limpiando imágenes antiguas/huérfanos..." -ForegroundColor Gray
docker image prune -f

Write-Host "`n🌟 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "----------------------------------"
Write-Host "🌍 App:     http://localhost:3000"
Write-Host "🛠️  API Docs: http://localhost:8000/docs"
Write-Host "----------------------------------`n"
