@echo off
echo ========================================
echo E-Commerce Application Runner
echo ========================================
echo.

:: Check if MySQL is running
echo 🔍 Checking MySQL connection...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ MySQL is not running or not accessible
    echo.
    echo 📋 Please ensure MySQL is installed and running:
    echo    1. Install MySQL from https://dev.mysql.com/downloads/
    echo    2. Start MySQL service: net start mysql
    echo    3. Or use the full setup script: setup-mysql-and-run.bat
    echo.
    pause
    exit /b 1
)

echo ✅ MySQL is running

:: Create database if it doesn't exist
echo 🗄️  Setting up database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" >nul 2>&1
echo ✅ Database ready

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
echo ✅ Application Started!
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