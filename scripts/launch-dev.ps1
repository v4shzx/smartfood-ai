# SmartFood AI - Development Environment Setup
# Prepara el entorno de desarrollo: Docker, DB schema y seed

Write-Host ""
Write-Host "[SMARTFOOD] Iniciando entorno de desarrollo (Docker)..." -ForegroundColor Cyan

# 1. Start Database Service
Write-Host ""
Write-Host "[1/4] Levantando base de datos..." -ForegroundColor Gray
docker-compose -f docker-compose.dev.yml up -d db

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo levantar el contenedor de la base de datos." -ForegroundColor Red
    exit 1
}

# 2. Wait for Postgres to be ready
Write-Host ""
Write-Host "[2/4] Esperando a que Postgres este listo..." -ForegroundColor Yellow
$retries = 10
$ready = $false

while ($retries -gt 0) {
    $status = docker exec smartfood_db_dev pg_isready -U postgres 2>$null
    if ($status -like "*accepting connections*") {
        Write-Host "[OK] Base de datos lista." -ForegroundColor Green
        $ready = $true
        break
    }
    Write-Host "    Reintentando... ($retries restantes)"
    $retries--
    Start-Sleep -Seconds 3
}

if (-not $ready) {
    Write-Host "[ERROR] La base de datos no respondio a tiempo." -ForegroundColor Red
    exit 1
}

# 3. Apply Schema and Seed
Write-Host ""
Write-Host "[3/4] Ejecutando schema.sql y seed_data.sql..." -ForegroundColor Gray
Get-Content backend\db\sql\schema.sql   | docker exec -i smartfood_db_dev psql -U postgres -d smartfood
Get-Content backend\db\sql\seed_data.sql | docker exec -i smartfood_db_dev psql -U postgres -d smartfood
Write-Host "[OK] Base de datos inicializada correctamente." -ForegroundColor Green

# 4. Start All Services
Write-Host ""
Write-Host "[4/4] Levantando Backend y Frontend..." -ForegroundColor Gray
docker-compose -f docker-compose.dev.yml up -d

Write-Host ""
Write-Host "=================================="
Write-Host " ENTORNO LISTO"
Write-Host "=================================="
Write-Host " Frontend : http://localhost:3000"
Write-Host " Backend  : http://localhost:8000/docs"
Write-Host " pgAdmin  : http://localhost:5050"
Write-Host "  Email   : admin@smartfood.ai"
Write-Host "  Pass    : admin"
Write-Host "=================================="
Write-Host ""
