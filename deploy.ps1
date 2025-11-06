# Store Business Application - Deploy Script
param(
    [string]$ImageName = "store-business-app",
    [string]$ContainerName = "store-business-container",
    [int]$Port = 4220,
    [switch]$SkipBuild,
    [switch]$CleanUp,
    [switch]$Help
)

if ($Help) {
    Write-Host "Store Business Application - Build and Deploy Script" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\deploy.ps1 [OPTIONS]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -ImageName      Docker image name (default: store-business-app)"
    Write-Host "  -ContainerName  Docker container name (default: store-business-container)"
    Write-Host "  -Port           Host port to map to container port 80 (default: 4220)"
    Write-Host "  -SkipBuild      Skip Angular build step"
    Write-Host "  -CleanUp        Remove existing containers and images"
    Write-Host "  -Help           Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1                           # Basic deployment"
    Write-Host "  .\deploy.ps1 -Port 9000               # Deploy on port 9000"
    Write-Host "  .\deploy.ps1 -CleanUp                 # Clean up and redeploy"
    exit 0
}

Write-Host "Store Business Application - Deploy" -ForegroundColor Green

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Cyan
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running" -ForegroundColor Red
    exit 1
}

# Cleanup if requested
if ($CleanUp) {
    Write-Host "Cleaning up..." -ForegroundColor Cyan
    docker stop $ContainerName 2>$null | Out-Null
    docker rm $ContainerName 2>$null | Out-Null
    docker rmi $ImageName 2>$null | Out-Null
}

# Build Angular app
if (-not $SkipBuild) {
    Write-Host "Building Angular application..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Angular build failed" -ForegroundColor Red
        exit 1
    }
}

# Stop existing container
docker stop $ContainerName 2>$null | Out-Null
docker rm $ContainerName 2>$null | Out-Null

# Build Docker image
Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t $ImageName .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed" -ForegroundColor Red
    exit 1
}

# Run container
Write-Host "Starting container..." -ForegroundColor Cyan
$containerId = docker run -d -p "${Port}:80" --name $ContainerName $ImageName

# Summary
Write-Host ""
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "URL: http://localhost:$Port" -ForegroundColor Yellow
Write-Host "Container: $ContainerName" -ForegroundColor Yellow
Write-Host ""
Write-Host "Commands:" -ForegroundColor Cyan
Write-Host "  Status:  .\status.ps1" -ForegroundColor White
Write-Host "  Logs:    docker logs $ContainerName" -ForegroundColor White
Write-Host "  Cleanup: .\cleanup.ps1" -ForegroundColor White