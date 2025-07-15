@echo off
echo Starting E-Commerce Application with MongoDB...

echo.
echo Choose your MongoDB setup:
echo 1. Docker (Recommended - Easy setup)
echo 2. Local MongoDB installation
echo 3. MongoDB Atlas (Cloud)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting MongoDB with Docker...
    docker-compose up -d mongodb mongo-express
    echo MongoDB is running on localhost:27017
    echo MongoDB Express (Admin UI) is running on http://localhost:8081
    echo Username: admin, Password: password123
    echo.
    echo Starting backend server...
    cd backend
    npm start
) else if "%choice%"=="2" (
    echo Please make sure MongoDB is installed and running locally
    echo Then start the backend server...
    cd backend
    npm start
) else if "%choice%"=="3" (
    echo Please update your .env file with MongoDB Atlas connection string
    echo Then start the backend server...
    cd backend
    npm start
) else (
    echo Invalid choice. Please run the script again.
    pause
) 