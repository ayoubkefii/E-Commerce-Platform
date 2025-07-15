@echo off
echo ========================================
echo E-Commerce MySQL Setup and Run Script
echo ========================================
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as administrator
) else (
    echo ❌ This script requires administrator privileges
    echo Please right-click and "Run as administrator"
    pause
    exit /b 1
)

:: Check if Chocolatey is installed
where choco >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Chocolatey is already installed
) else (
    echo 📦 Installing Chocolatey...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if %errorLevel% neq 0 (
        echo ❌ Failed to install Chocolatey
        pause
        exit /b 1
    )
    echo ✅ Chocolatey installed successfully
)

:: Check if MySQL is installed
where mysql >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ MySQL is already installed
) else (
    echo 📦 Installing MySQL...
    choco install mysql -y
    if %errorLevel% neq 0 (
        echo ❌ Failed to install MySQL
        pause
        exit /b 1
    )
    echo ✅ MySQL installed successfully
)

:: Start MySQL service
echo 🔄 Starting MySQL service...
net start mysql
if %errorLevel% neq 0 (
    echo ⚠️  MySQL service might already be running or needs manual start
)

:: Wait a moment for MySQL to fully start
timeout /t 5 /nobreak >nul

:: Set MySQL root password (if not already set)
echo 🔐 Setting up MySQL root password...
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '';" 2>nul
if %errorLevel% neq 0 (
    echo ⚠️  MySQL root password setup skipped (might already be configured)
)

:: Create database
echo 🗄️  Creating ecommerce database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %errorLevel% neq 0 (
    echo ⚠️  Database creation skipped (might already exist)
)

:: Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorLevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

:: Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorLevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

:: Go back to root directory
cd ..

:: Start the application
echo 🚀 Starting the e-commerce application...
echo.
echo 📋 Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo 📋 Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 📊 Health Check: http://localhost:5000/api/health
echo.
echo 📝 The application should open automatically in your browser
echo 📝 If not, manually navigate to: http://localhost:3000
echo.
echo ⚠️  Keep these terminal windows open to run the application
echo ⚠️  Close them to stop the servers
echo.
pause 