@echo off
echo ========================================
echo E-Commerce Quick Start Guide
echo ========================================
echo.

echo 🚀 Setting up your E-Commerce application...
echo.

echo 📋 Prerequisites:
echo - Node.js installed
echo - npm installed
echo - Internet connection for MongoDB Atlas
echo.

echo 🔗 Step 1: MongoDB Atlas Setup
echo.
echo Please follow these steps to set up MongoDB Atlas:
echo.
echo 1. Open your browser and go to: https://www.mongodb.com/atlas
echo 2. Click "Try Free" and create an account
echo 3. Create a new cluster (choose FREE tier)
echo 4. Set up database access:
echo    - Username: ecommerce_user
echo    - Password: ecommerce123
echo    - Role: Read and write to any database
echo 5. Set up network access:
echo    - Click "Allow Access from Anywhere"
echo 6. Get your connection string:
echo    - Click "Connect" on your cluster
echo    - Choose "Connect your application"
echo    - Copy the connection string
echo.

pause

echo.
echo 📝 Step 2: Enter your MongoDB Atlas connection string
echo.
echo The connection string should look like:
echo mongodb+srv://ecommerce_user:ecommerce123@cluster.mongodb.net/ecommerce
echo.

set /p mongo_uri="Paste your MongoDB Atlas connection string: "

if "%mongo_uri%"=="" (
    echo ❌ No connection string provided. Please run the script again.
    pause
    exit /b 1
)

echo.
echo ✅ Connection string received!
echo.

echo 🔧 Step 3: Installing dependencies...
echo.

echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies.
    pause
    exit /b 1
)

echo Installing frontend dependencies...
cd ../frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies.
    pause
    exit /b 1
)

echo.
echo 📝 Step 4: Updating configuration...
echo.

cd ../backend

echo # Server Configuration > .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
echo. >> .env
echo # Database - MongoDB Atlas >> .env
echo MONGODB_URI=%mongo_uri% >> .env
echo. >> .env
echo # JWT Configuration >> .env
echo JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789 >> .env
echo. >> .env
echo # Stripe Configuration (Test Keys) >> .env
echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here >> .env
echo STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here >> .env
echo. >> .env
echo # Cloudinary Configuration (Optional) >> .env
echo CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name >> .env
echo CLOUDINARY_API_KEY=your_cloudinary_api_key >> .env
echo CLOUDINARY_API_SECRET=your_cloudinary_api_secret >> .env
echo. >> .env
echo # Frontend URL (for CORS) >> .env
echo FRONTEND_URL=http://localhost:3000 >> .env
echo. >> .env
echo # Email Configuration (Optional) >> .env
echo MAILTRAP_HOST=smtp.mailtrap.io >> .env
echo MAILTRAP_PORT=2525 >> .env
echo MAILTRAP_USER=your_mailtrap_username >> .env
echo MAILTRAP_PASS=your_mailtrap_password >> .env
echo. >> .env
echo # Rate Limiting >> .env
echo RATE_LIMIT_WINDOW_MS=900000 >> .env
echo RATE_LIMIT_MAX_REQUESTS=100 >> .env

echo ✅ Configuration updated!
echo.

echo 🌱 Step 5: Seeding the database...
echo.

npm run seed
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database.
    pause
    exit /b 1
)

echo ✅ Database seeded successfully!
echo.

echo 🎉 Step 6: Starting the application...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend server...
cd ../frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo 🎉 Setup Complete!
echo ========================================
echo.
echo Your E-Commerce application is now running:
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 📊 API Health: http://localhost:5000/api/health
echo.
echo 👤 Test Accounts:
echo - Admin: admin@ecommerce.com / admin123
echo - User: user@ecommerce.com / user123
echo.
echo 📚 Documentation: README.md
echo 🗄️ MongoDB Setup: MONGODB_SETUP.md
echo.
echo Press any key to exit...
pause >nul 