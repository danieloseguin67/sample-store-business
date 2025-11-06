# Cleanup Script for Store Business Application
# Removes containers and images

Write-Host "🧹 Store Business Application - Cleanup" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow

# Stop and remove container
Write-Host "🔄 Stopping and removing container..." -ForegroundColor Cyan
$container = docker ps -a --filter "name=store-business-container" --format "{{.ID}}"
if ($container) {
    docker stop $container | Out-Null
    docker rm $container | Out-Null
    Write-Host "✅ Container removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No container found" -ForegroundColor Blue
}

# Remove image
Write-Host "🔄 Removing Docker image..." -ForegroundColor Cyan
$image = docker images --filter "reference=store-business-app" --format "{{.ID}}"
if ($image) {
    docker rmi $image | Out-Null
    Write-Host "✅ Image removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No image found" -ForegroundColor Blue
}

# Clean up build artifacts
Write-Host "🔄 Cleaning build artifacts..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Build artifacts cleaned" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No build artifacts found" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 Cleanup completed!" -ForegroundColor Green