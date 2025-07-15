# E-Commerce MySQL Setup and Run Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E-Commerce MySQL Setup and Run Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires administrator privileges" -ForegroundColor Red
    Write-Host "Please right-click and 'Run as administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
} else {
    Write-Host "✅ Running as administrator" -ForegroundColor Green
}

# Check if Chocolatey is installed
if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "✅ Chocolatey is already installed" -ForegroundColor Green
} else {
    Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "✅ Chocolatey installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Chocolatey: $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if MySQL is installed
if (Get-Command mysql -ErrorAction SilentlyContinue) {
    Write-Host "✅ MySQL is already installed" -ForegroundColor Green
} else {
    Write-Host "📦 Installing MySQL..." -ForegroundColor Yellow
    try {
        choco install mysql -y
        Write-Host "✅ MySQL installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install MySQL: $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Start MySQL service
Write-Host "🔄 Starting MySQL service..." -ForegroundColor Yellow
try {
    Start-Service mysql -ErrorAction Stop
    Write-Host "✅ MySQL service started" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MySQL service might already be running or needs manual start" -ForegroundColor Yellow
}

# Wait a moment for MySQL to fully start
Start-Sleep -Seconds 5

# Set MySQL root password (if not already set)
Write-Host "🔐 Setting up MySQL root password..." -ForegroundColor Yellow
try {
    mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '';" 2>$null
    Write-Host "✅ MySQL root password configured" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MySQL root password setup skipped (might already be configured)" -ForegroundColor Yellow
}

# Create database
Write-Host "🗄️  Creating ecommerce database..." -ForegroundColor Yellow
try {
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
    Write-Host "✅ Database created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Database creation skipped (might already exist)" -ForegroundColor Yellow
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
try {
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install backend dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
try {
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install frontend dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Go back to root directory
Set-Location ..

# Start the application
Write-Host "🚀 Starting the e-commerce application..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Starting backend server..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd backend && npm run dev" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host "📋 Starting frontend server..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd frontend && npm start" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor White
Write-Host "📊 Health Check: http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "📝 The application should open automatically in your browser" -ForegroundColor White
Write-Host "📝 If not, manually navigate to: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Keep these terminal windows open to run the application" -ForegroundColor Yellow
Write-Host "⚠️  Close them to stop the servers" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue" 