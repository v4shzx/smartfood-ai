# Prepare Development Environment for SmartFood AI

Write-Host "`n🚀 Iniciando entorno de desarrollo (Docker)..." -ForegroundColor Cyan

# 1. Start Database Service
Write-Host "`n[1/4] Levatando base de datos..." -ForegroundColor Gray
docker-compose -f docker-compose.dev.yml up -d db

# 2. Wait for Postgres to be ready
Write-Host "`n[2/4] Esperando a que el motor de base de datos esté listo..." -ForegroundColor Yellow
$retries = 10
while ($retries -gt 0) {
    $status = docker exec smartfood_db_dev pg_isready -U postgres 2>$null
    if ($status -like "*accepting connections*") {
        Write-Host "✅ Base de datos lista para recibir conexiones." -ForegroundColor Green
        break
    }
    Write-Host "..."
    $retries--
    Start-Sleep -Seconds 3
}

if ($retries -eq 0) {
    Write-Host "❌ Error: La base de datos no respondió a tiempo." -ForegroundColor Red
    exit 1
}

# 3. Create Schema and Seed data
Write-Host "`n[3/4] Ejecutando esquema y semillas (SQL)..." -ForegroundColor Gray
Get-Content backend/db/sql/schema.sql | docker exec -i smartfood_db_dev psql -U postgres -d smartfood > $null
Get-Content backend/db/sql/seed_data.sql | docker exec -i smartfood_db_dev psql -U postgres -d smartfood > $null
Write-Host "✅ Base de datos inicializada correctamente." -ForegroundColor Green

# 4. Start Application Services
Write-Host "`n[4/4] Levantando Backend y Frontend..." -ForegroundColor Gray
docker-compose -f docker-compose.dev.yml up -d

Write-Host "`n✨ ¡ENTORNO LISTO!" -ForegroundColor Green
Write-Host "----------------------------------"
Write-Host "🖥️  Frontend: http://localhost:3000"
Write-Host "⚙️  Backend:  http://localhost:8000/docs"
Write-Host "📊 pgAdmin:  http://localhost:5050 (admin@smartfood.ai / admin)"
Write-Host "----------------------------------"
Write-Host ""
