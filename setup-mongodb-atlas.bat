@echo off
echo ========================================
echo E-Commerce MongoDB Atlas Setup
echo ========================================
echo.

echo Setting up MongoDB Atlas (Cloud Database)...
echo.
echo Please follow these steps:
echo.
echo 1. Go to https://www.mongodb.com/atlas
echo 2. Create a free account
echo 3. Create a new cluster (choose FREE tier)
echo 4. Click "Connect" on your cluster
echo 5. Choose "Connect your application"
echo 6. Copy the connection string
echo.
echo The connection string looks like:
echo mongodb+srv://username:password@cluster.mongodb.net/ecommerce
echo.
echo Replace username, password, and cluster with your actual values.
echo.

set /p atlas_uri="Paste your MongoDB Atlas connection string here: "

if "%atlas_uri%"=="" (
    echo No connection string provided. Exiting.
    pause
    exit /b 1
)

echo.
echo Updating .env file with your MongoDB Atlas connection...
cd backend

echo # Server Configuration > .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
echo. >> .env
echo # Database - MongoDB Atlas >> .env
echo MONGODB_URI=%atlas_uri% >> .env
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

echo .env file updated successfully!
echo.

echo Installing backend dependencies...
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