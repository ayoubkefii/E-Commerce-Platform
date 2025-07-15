#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Setting up E-Commerce Application...\n");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion < 16) {
    log("❌ Node.js version 16 or higher is required!", "red");
    log(`Current version: ${nodeVersion}`, "yellow");
    process.exit(1);
  }

  log(`✅ Node.js version: ${nodeVersion}`, "green");
}

function checkMongoDB() {
  log("📋 Checking MongoDB installation...", "blue");

  try {
    execSync("mongod --version", { stdio: "ignore" });
    log("✅ MongoDB is installed", "green");
  } catch (error) {
    log("⚠️  MongoDB not found or not in PATH", "yellow");
    log("Please install MongoDB and ensure it's running", "yellow");
    log("Visit: https://docs.mongodb.com/manual/installation/", "cyan");
  }
}

function createEnvFiles() {
  log("📝 Creating environment files...", "blue");

  // Backend .env
  const backendEnvPath = path.join(__dirname, "backend", ".env");
  if (!fs.existsSync(backendEnvPath)) {
    const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_${Date.now()}

# Stripe Configuration (Test Keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

    fs.writeFileSync(backendEnvPath, backendEnvContent);
    log("✅ Created backend/.env", "green");
  } else {
    log("ℹ️  backend/.env already exists", "yellow");
  }

  // Frontend .env
  const frontendEnvPath = path.join(__dirname, "frontend", ".env");
  if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnvContent = `# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Stripe Configuration (Test Keys)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
REACT_APP_NAME=E-Commerce Store
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG_MODE=true
`;

    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    log("✅ Created frontend/.env", "green");
  } else {
    log("ℹ️  frontend/.env already exists", "yellow");
  }
}

function installDependencies() {
  log("📦 Installing dependencies...", "blue");

  // Install backend dependencies
  log("Installing backend dependencies...", "cyan");
  try {
    execSync("npm install", {
      cwd: path.join(__dirname, "backend"),
      stdio: "inherit",
    });
    log("✅ Backend dependencies installed", "green");
  } catch (error) {
    log("❌ Failed to install backend dependencies", "red");
    process.exit(1);
  }

  // Install frontend dependencies
  log("Installing frontend dependencies...", "cyan");
  try {
    execSync("npm install", {
      cwd: path.join(__dirname, "frontend"),
      stdio: "inherit",
    });
    log("✅ Frontend dependencies installed", "green");
  } catch (error) {
    log("❌ Failed to install frontend dependencies", "red");
    process.exit(1);
  }
}

function seedDatabase() {
  log("🌱 Seeding database...", "blue");

  try {
    execSync("npm run seed", {
      cwd: path.join(__dirname, "backend"),
      stdio: "inherit",
    });
    log("✅ Database seeded successfully", "green");
  } catch (error) {
    log(
      "⚠️  Failed to seed database. You can run it manually later with: npm run seed",
      "yellow"
    );
  }
}

function createStartScripts() {
  log("📜 Creating start scripts...", "blue");

  const packageJsonPath = path.join(__dirname, "package.json");
  const packageJson = {
    name: "ecommerce-fullstack",
    version: "1.0.0",
    description: "Full-stack E-Commerce application",
    scripts: {
      "install-all":
        "npm install && cd backend && npm install && cd ../frontend && npm install",
      dev: 'concurrently "npm run server" "npm run client"',
      server: "cd backend && npm run dev",
      client: "cd frontend && npm start",
      build: "cd frontend && npm run build",
      seed: "cd backend && npm run seed",
      start: "cd backend && npm start",
    },
    devDependencies: {
      concurrently: "^7.6.0",
    },
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log("✅ Created root package.json with scripts", "green");

  // Install concurrently for running both servers
  try {
    execSync("npm install", { stdio: "ignore" });
    log("✅ Installed concurrently for development", "green");
  } catch (error) {
    log("⚠️  Failed to install concurrently", "yellow");
  }
}

function showNextSteps() {
  log("\n🎉 Setup completed successfully!", "green");
  log("\n📋 Next steps:", "bright");
  log("1. Start MongoDB service", "cyan");
  log(
    "2. Update environment variables in backend/.env and frontend/.env",
    "cyan"
  );
  log(
    "3. Get Stripe test keys from https://dashboard.stripe.com/test/apikeys",
    "cyan"
  );
  log("4. Run the application:", "cyan");
  log("   - Development: npm run dev", "yellow");
  log("   - Backend only: npm run server", "yellow");
  log("   - Frontend only: npm run client", "yellow");

  log("\n🔑 Test Accounts:", "bright");
  log("Admin - Email: admin@ecommerce.com, Password: admin123", "green");
  log("User - Email: user@ecommerce.com, Password: user123", "green");

  log("\n🌐 Access URLs:", "bright");
  log("Frontend: http://localhost:3000", "cyan");
  log("Backend API: http://localhost:5000/api", "cyan");
  log("API Health Check: http://localhost:5000/api/health", "cyan");

  log("\n📚 Documentation:", "bright");
  log("README.md - Complete setup and usage guide", "cyan");
  log(
    "API Documentation - Available at /api/health when server is running",
    "cyan"
  );
}

// Main setup function
function main() {
  try {
    checkNodeVersion();
    checkMongoDB();
    createEnvFiles();
    installDependencies();
    createStartScripts();
    seedDatabase();
    showNextSteps();
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run setup
main();
