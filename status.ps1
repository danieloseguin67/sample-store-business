# Store Business Application - Status Check
Write-Host "🏪 Store Business Application Status" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Check if container is running
$container = docker ps --filter "name=store-business-container" --format "{{.ID}}"
if ($container) {
    $status = docker ps --filter "id=$container" --format "{{.Status}}"
    $ports = docker ps --filter "id=$container" --format "{{.Ports}}"
    
    Write-Host "📦 Container Status: Running" -ForegroundColor Green
    Write-Host "🔑 Container ID: $container" -ForegroundColor Blue
    Write-Host "⏰ Status: $status" -ForegroundColor Blue
    Write-Host "🌐 Ports: $ports" -ForegroundColor Blue
    
    # Test application
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4220" -Method Head -TimeoutSec 5
        Write-Host "✅ Application: Responding (Status: $($response.StatusCode))" -ForegroundColor Green
        Write-Host "🌍 URL: http://localhost:4220" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Application: Not responding" -ForegroundColor Red
    }
} else {
    Write-Host "📦 Container Status: Not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the application:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "Commands:" -ForegroundColor Blue
Write-Host "  Deploy:    .\deploy.ps1" -ForegroundColor White
Write-Host "  Logs:      docker logs store-business-container" -ForegroundColor White
Write-Host "  Stop:      docker stop store-business-container" -ForegroundColor White
Write-Host "  Cleanup:   .\cleanup.ps1" -ForegroundColor White