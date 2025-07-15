# 🚀 Quick Start - E-Commerce with MySQL

## Option 1: Automatic Setup (Recommended)

**Right-click on `setup-mysql-and-run.bat` and select "Run as administrator"**

This will automatically:

- Install Chocolatey package manager
- Install MySQL
- Set up the database
- Install dependencies
- Start both servers

## Option 2: Manual Setup

### Step 1: Install MySQL

1. **Download MySQL:**

   - Go to: https://dev.mysql.com/downloads/mysql/
   - Download "MySQL Installer for Windows"
   - Choose "Developer Default" or "Server only"

2. **Install MySQL:**

   - Run the installer as Administrator
   - Choose "Developer Default" setup type
   - Set root password (or leave empty for development)
   - Complete the installation

3. **Start MySQL Service:**
   ```cmd
   net start mysql
   ```

### Step 2: Set Up Database

1. **Create Database:**
   ```cmd
   mysql -u root -p
   CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

### Step 3: Install Dependencies

1. **Backend:**

   ```cmd
   cd backend
   npm install
   ```

2. **Frontend:**
   ```cmd
   cd frontend
   npm install
   ```

### Step 4: Run the Application

1. **Start Backend:**

   ```cmd
   cd backend
   npm run dev
   ```

2. **Start Frontend (new terminal):**
   ```cmd
   cd frontend
   npm start
   ```

## Option 3: Using Docker (Alternative)

If you have Docker installed:

```cmd
# Install MySQL via Docker
docker run --name mysql-ecommerce -e MYSQL_ROOT_PASSWORD= -e MYSQL_DATABASE=ecommerce -p 3306:3306 -d mysql:8.0

# Wait for MySQL to start (about 30 seconds)
timeout /t 30

# Then run the application
run-app.bat
```

## 🌐 Access Your Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 🔐 Default Login Credentials

- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

## 🛠️ Troubleshooting

### MySQL Issues

```cmd
# Check if MySQL is running
net start mysql

# Test connection
mysql -u root -e "SELECT 1;"

# Create database manually
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ecommerce;"
```

### Port Issues

- Backend: 5000
- Frontend: 3000
- MySQL: 3306

### Permission Issues

- Run as Administrator
- Check Windows Defender/Firewall

## 📞 Need Help?

1. Check the console output for error messages
2. Ensure MySQL service is running
3. Verify database connection in `backend/.env`
4. Check if ports are available

---

**Your e-commerce application will be ready in minutes! 🛒**
