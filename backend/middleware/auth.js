const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!req.user.is_active) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware - require admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Admin privileges required." });
  }
};

// Optional auth - doesn't require authentication but adds user if available
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
    } catch (error) {
      // Token is invalid but we don't throw error for optional auth
      console.log("Optional auth token verification failed:", error.message);
    }
  }

  next();
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  protect,
  admin,
  optionalAuth,
  generateToken,
};
