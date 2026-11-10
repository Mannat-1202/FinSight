# FinSight - Startup Script
# Starts all 3 services: ML (Python/FastAPI), Backend (Java/Spring Boot), Frontend (Next.js)
# Usage: Right-click > "Run with PowerShell" OR: pwsh -File start.ps1

$root = $PSScriptRoot

# --- Colors ---
function Write-Header($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Ok($msg)     { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg)   { Write-Host "  [WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)    { Write-Host "  [ERR] $msg" -ForegroundColor Red }

Write-Header "FinSight Startup"

# --- 1. ML Service (FastAPI on port 8000) ---
Write-Header "Starting ML Service (FastAPI) on http://localhost:8000"
$py = Join-Path $root "ml-service\.venv\Scripts\python.exe"
if (-not (Test-Path $py)) {
    Write-Err "Python venv not found at $py"
    Write-Warn "Run: cd ml-service && python -m venv .venv && .venv\Scripts\pip install -r requirements.txt"
} else {
    $mlJob = Start-Process -FilePath $py `
        -ArgumentList "-m", "uvicorn", "app.main:app", "--port", "8000", "--reload" `
        -WorkingDirectory (Join-Path $root "ml-service") `
        -PassThru -WindowStyle Normal
    Write-Ok "ML Service started (PID $($mlJob.Id)) → http://localhost:8000/health"
}

Start-Sleep -Seconds 2

# --- 2. Backend (Spring Boot on port 8080) ---
Write-Header "Starting Backend (Spring Boot) on http://localhost:8080"
$mvn = "$env:USERPROFILE\.m2\wrapper\dists\apache-maven-3.9.9-bin\33b4b2b4\apache-maven-3.9.9\bin\mvn.cmd"
if (-not (Test-Path $mvn)) {
    # Try system maven
    $mvn = "mvn"
    Write-Warn "Maven wrapper not found, trying 'mvn' from PATH"
}
$beJob = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c", "`"$mvn`" -f `"$root\backend\pom.xml`" spring-boot:run" `
    -WorkingDirectory (Join-Path $root "backend") `
    -PassThru -WindowStyle Normal
Write-Ok "Backend started (PID $($beJob.Id)) → http://localhost:8080/api/health"

Start-Sleep -Seconds 5

# --- 3. Frontend (Next.js on port 3000) ---
Write-Header "Starting Frontend (Next.js) on http://localhost:3000"
$feJob = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c", "npm run dev" `
    -WorkingDirectory (Join-Path $root "frontend") `
    -PassThru -WindowStyle Normal
Write-Ok "Frontend started (PID $($feJob.Id)) → http://localhost:3000"

Write-Header "All services launched!"
Write-Host @"

  Service     URL                       Status
  ----------- ------------------------- --------
  ML Service  http://localhost:8000     Check /health
  Backend     http://localhost:8080     Check /api/health
  Frontend    http://localhost:3000     Open in browser

  MySQL must be running on localhost:3306
  DB: finsight_db  |  User: root  |  Pass: root (edit backend/src/main/resources/application.properties)

  Press CTRL+C in each terminal window to stop.
"@ -ForegroundColor White

