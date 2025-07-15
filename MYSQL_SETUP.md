# E-Commerce Application - MySQL Setup Guide

This guide will help you set up and run the e-commerce application with MySQL database.

## 🚀 Quick Start Options

### Option 1: Automatic Setup (Recommended)

Run the automatic setup script that will install everything for you:

**Windows (Batch):**

```bash
# Right-click and "Run as administrator"
setup-mysql-and-run.bat
```

**Windows (PowerShell):**

```powershell
# Right-click and "Run as administrator"
.\setup-mysql-and-run.ps1
```

### Option 2: Manual Setup

If you prefer to install MySQL manually or already have it installed:

```bash
# Run the application (assumes MySQL is already installed)
run-app.bat
```

## 📋 Prerequisites

- Windows 10/11
- Node.js (v16 or higher)
- npm (comes with Node.js)
- Administrator privileges (for automatic setup)

## 🗄️ MySQL Installation

### Automatic Installation (via Chocolatey)

The setup scripts will automatically install MySQL using Chocolatey package manager.

### Manual Installation

1. Download MySQL from: https://dev.mysql.com/downloads/
2. Install MySQL Server
3. Set root password (or leave empty for development)
4. Start MySQL service

### Start MySQL Service

```bash
# Start MySQL service
net start mysql

# Check if MySQL is running
mysql --version
```

## 🔧 Database Configuration

The application uses the following MySQL configuration:

- **Host:** localhost
- **Port:** 3306
- **Database:** ecommerce
- **User:** root
- **Password:** (empty for development)

### Environment Variables

The configuration is stored in `backend/.env`:

```env
# Database - MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=
```

## 📦 Application Structure

```
e-commerce/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── .env               # Environment variables
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── store/         # Redux store
│   └── package.json
├── setup-mysql-and-run.bat    # Automatic setup (Windows)
├── setup-mysql-and-run.ps1    # Automatic setup (PowerShell)
└── run-app.bat               # Manual run script
```

## 🚀 Running the Application

### Backend Server

```bash
cd backend
npm install
npm run dev
```

### Frontend Server

```bash
cd frontend
npm install
npm start
```

### Both Servers (Automatic)

```bash
# Windows
run-app.bat

# Or use the full setup script
setup-mysql-and-run.bat
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 📊 Database Models

The application includes the following MySQL tables:

- **Users** - User accounts and authentication
- **Products** - Product catalog
- **Reviews** - Product reviews and ratings
- **Carts** - Shopping cart management
- **CartItems** - Individual cart items
- **Orders** - Order management
- **OrderItems** - Individual order items
- **ShippingAddresses** - User shipping addresses

## 🔐 Default Credentials

The application will create sample data with these credentials:

- **Admin User:**

  - Email: admin@example.com
  - Password: admin123

- **Regular User:**
  - Email: user@example.com
  - Password: user123

## 🛠️ Troubleshooting

### MySQL Connection Issues

1. Ensure MySQL service is running: `net start mysql`
2. Check if MySQL is accessible: `mysql -u root -e "SELECT 1;"`
3. Verify database exists: `mysql -u root -e "SHOW DATABASES;"`

### Port Conflicts

- Backend runs on port 5000
- Frontend runs on port 3000
- MySQL runs on port 3306

If ports are in use, modify the configuration in:

- Backend: `backend/.env` (PORT=5000)
- Frontend: `frontend/package.json` (scripts.start)

### Permission Issues

- Run setup scripts as Administrator
- Ensure you have write permissions to the project directory

### Node.js Issues

- Ensure Node.js v16+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 📝 Development Notes

### Database Migrations

The application uses Sequelize with auto-sync for development:

```javascript
await sequelize.sync({ alter: true });
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp backend/.env.example backend/.env
```

### API Endpoints

- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Cart: `/api/cart/*`
- Orders: `/api/orders/*`
- Users: `/api/users/*`

## 🎯 Features

- ✅ User authentication (JWT)
- ✅ Product catalog with search/filter
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ User profiles
- ✅ Product reviews
- ✅ Responsive design
- ✅ Admin dashboard
- ✅ Payment integration (Stripe ready)

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check the console output for error messages
4. Ensure MySQL service is running
5. Verify database connection settings

## 🔄 Updates

To update the application:

1. Pull latest changes: `git pull`
2. Update dependencies: `npm install` (in both backend and frontend)
3. Restart the application

---

**Happy Shopping! 🛒**
