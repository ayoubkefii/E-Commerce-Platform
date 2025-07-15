const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  createPaymentIntent,
  confirmPayment,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/auth");

// Validation middleware
const createOrderValidation = [
  body("paymentMethod")
    .isIn(["stripe", "paypal", "cod"])
    .withMessage("Invalid payment method"),
  body("shippingAddress.street")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Street address is required"),
  body("shippingAddress.city")
    .trim()
    .isLength({ min: 2 })
    .withMessage("City is required"),
  body("shippingAddress.state")
    .trim()
    .isLength({ min: 2 })
    .withMessage("State is required"),
  body("shippingAddress.zipCode")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Valid ZIP code is required"),
  body("shippingAddress.country")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Country is required"),
  body("shippingAddress.phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

const cancelOrderValidation = [
  body("reason")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Cancellation reason must be between 5 and 200 characters"),
];

const updateStatusValidation = [
  body("status")
    .isIn([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ])
    .withMessage("Invalid order status"),
  body("trackingNumber")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Tracking number is required if provided"),
  body("carrier")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Carrier is required if tracking number is provided"),
];

// User routes (require authentication)
router.use(protect);

router.post("/", createOrderValidation, createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.post("/:id/payment-intent", createPaymentIntent);
router.post("/:id/confirm-payment", confirmPayment);
router.put("/:id/cancel", cancelOrderValidation, cancelOrder);

// Admin routes (require admin privileges)
router.get("/admin/all", admin, getAllOrders);
router.get("/admin/stats", admin, getOrderStats);
router.put("/:id/status", admin, updateStatusValidation, updateOrderStatus);

module.exports = router;
