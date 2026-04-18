Write-Host "===> Iniciando limpieza total y reconstrucción..." -ForegroundColor Blue

# Moverse a la raíz del proyecto
Set-Location "$PSScriptRoot\.."
Write-Host "Directorio de trabajo: $(Get-Location)" -ForegroundColor Gray

Write-Host "1. Deteniendo servicios y eliminando volúmenes (limpieza de BD)..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down -v

Write-Host "2. Reconstruyendo imágenes de Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml build --no-cache

Write-Host "3. Levantando servicios..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up -d

Write-Host "4. Esperando a que el backend esté listo..." -ForegroundColor Yellow
$ready = $false
while (-not $ready) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method Get -ErrorAction Stop
        if ($response.StatusCode -eq 200) { $ready = $true }
    } catch {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
}
Write-Host "`nBackend detectado!" -ForegroundColor Green

Write-Host "5. Inyectando datos de demostración y personal..." -ForegroundColor Yellow
docker exec smartfood_backend_dev python -m app.seed_demo

Write-Host "===============================================" -ForegroundColor Green
Write-Host "   LIMPIEZA Y RECONSTRUCCIÓN COMPLETADA        " -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000             " -ForegroundColor Green
Write-Host "   Backend:  http://localhost:8000/docs        " -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
