# FinSight - Stop Script
# Kills processes listening on ports 8000, 8080, 3000

function Kill-Port($port) {
    $result = netstat -ano | Select-String ":$port\s" | Select-String "LISTENING"
    if ($result) {
        $pid_ = ($result -split '\s+')[-1]
        Stop-Process -Id $pid_ -Force -ErrorAction SilentlyContinue
        Write-Host "Killed process on port $port (PID $pid_)" -ForegroundColor Yellow
    } else {
        Write-Host "Nothing listening on port $port" -ForegroundColor Gray
    }
}

Write-Host "Stopping FinSight services..." -ForegroundColor Cyan
Kill-Port 8000
Kill-Port 8080
Kill-Port 3000
Write-Host "Done." -ForegroundColor Green

