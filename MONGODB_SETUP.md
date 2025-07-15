# MongoDB Setup Guide for E-Commerce Application

## 🚀 Quick Start Options

### Option 1: MongoDB Atlas (Recommended - Cloud Database)

**No installation required!**

1. **Create Free MongoDB Atlas Account:**

   - Go to: https://www.mongodb.com/atlas
   - Click "Try Free"
   - Sign up with email or Google account

2. **Create Database Cluster:**

   - Choose "FREE" tier (M0)
   - Select cloud provider (AWS/Google Cloud/Azure)
   - Choose region closest to you
   - Click "Create"

3. **Set Up Database Access:**

   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `ecommerce_user`
   - Password: `ecommerce123` (or your own)
   - Role: "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access:**

   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String:**

   - Go back to "Database" tab
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Your .env File:**
   ```env
   MONGODB_URI=mongodb+srv://ecommerce_user:your_password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB Installation

#### Windows:

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run installer as Administrator
3. Choose "Complete" installation
4. Install MongoDB as a service
5. Use connection string: `mongodb://localhost:27017/ecommerce`

#### macOS:

```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

#### Linux (Ubuntu):

```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 3: Docker (If you have Docker installed)

```bash
# Start MongoDB with Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Or use the provided docker-compose.yml
docker-compose up -d mongodb
```

## 🔧 Setup Scripts

### For Windows:

```bash
# Option 1: Local MongoDB
setup-mongodb.bat

# Option 2: MongoDB Atlas
setup-mongodb-atlas.bat
```

### For macOS/Linux:

```bash
# Make scripts executable
chmod +x start-mongodb.sh

# Run setup
./start-mongodb.sh
```

## 🗄️ Database Collections

Your application will automatically create these collections:

- **`users`** - User accounts and profiles
- **`products`** - Product catalog
- **`carts`** - Shopping carts
- **`orders`** - Order history

## 🌱 Seed Data

After setting up MongoDB, run the seed script to populate with sample data:

```bash
cd backend
npm run seed
```

This will create:

- Admin user: `admin@ecommerce.com` / `admin123`
- Regular user: `user@ecommerce.com` / `user123`
- Sample products for testing

## 🔍 Test Your Setup

1. **Start the backend:**

   ```bash
   cd backend
   npm start
   ```

2. **Test the API:**

   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Expected response:**
   ```json
   {
     "status": "OK",
     "message": "E-Commerce API is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

## 🛠️ Troubleshooting

### Connection Issues:

- Check if MongoDB is running
- Verify connection string in `.env`
- Ensure network access is configured (for Atlas)
- Check firewall settings

### Permission Issues:

- Run as Administrator (Windows)
- Check MongoDB service status
- Verify user credentials

### Common Error Messages:

- `ECONNREFUSED`: MongoDB not running
- `Authentication failed`: Wrong credentials
- `Network access denied`: IP not whitelisted (Atlas)

## 📞 Support

If you encounter issues:

1. Check the MongoDB logs
2. Verify your connection string
3. Ensure all dependencies are installed
4. Check the troubleshooting section above

---

**Your MongoDB is now ready!** 🎉
