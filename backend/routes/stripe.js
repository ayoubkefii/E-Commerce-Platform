const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
  getSessionDetails,
  stripeHealthCheck,
} = require("../controllers/stripeController");

// Health check endpoint
router.get("/health", stripeHealthCheck);

// Create checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Get session details
router.get("/session/:sessionId", getSessionDetails);

// Webhook endpoint - uses raw body for signature verification
// This route will be handled separately in server.js with express.raw() middleware

module.exports = router;
