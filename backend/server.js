const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import database configuration
const { sequelize, testConnection } = require("./config/database");

// Import models
require("./models/index");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const wishlistRoutes = require("./routes/wishlist");
const stripeRoutes = require("./routes/stripe");
const searchRoutes = require("./routes/search");

// Import Stripe webhook handler
const { handleWebhook } = require("./controllers/stripeController");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
// Only enable rate limiting in production
if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Stripe webhook endpoint - must use raw body for signature verification
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// Static files
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/search", searchRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "E-Commerce API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized successfully");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(
        `💳 Stripe health check: http://localhost:${PORT}/api/stripe/health`
      );
      console.log(
        `🌐 Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await sequelize.close();
  console.log("Database connection closed");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await sequelize.close();
  console.log("Database connection closed");
  process.exit(0);
});

// Start the server
startServer();
