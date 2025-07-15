@echo off
echo ========================================
echo E-Commerce MongoDB Setup
echo ========================================
echo.

echo Checking if MongoDB is installed...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed.
    echo.
    echo Please install MongoDB Community Edition:
    echo 1. Go to: https://www.mongodb.com/try/download/community
    echo 2. Download MongoDB Community Server for Windows
    echo 3. Run the installer and follow the setup wizard
    echo 4. Make sure to install MongoDB as a service
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
) else (
    echo MongoDB is installed!
)

echo.
echo Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB service is not running. Starting it...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo Failed to start MongoDB service.
        echo Please start it manually or run as Administrator.
        pause
        exit /b 1
    )
) else (
    echo MongoDB service is running!
)

echo.
echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies.
    pause
    exit /b 1
)

echo.
echo Seeding the database with sample data...
npm run seed
if %errorlevel% neq 0 (
    echo Failed to seed database.
    pause
    exit /b 1
)

echo.
echo Starting the backend server...
npm start 