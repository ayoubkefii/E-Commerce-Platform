const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  setShippingAddress,
  setShippingMethod,
  getCartSummary,
} = require("../controllers/cartController");

const { protect } = require("../middleware/auth");

// Validation middleware
const addToCartValidation = [
  body("productId").isInt({ min: 1 }).withMessage("Invalid product ID"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const updateCartValidation = [
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

const couponValidation = [
  body("code")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Coupon code is required"),
];

const shippingAddressValidation = [
  body("street")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Street address is required"),
  body("city").trim().isLength({ min: 2 }).withMessage("City is required"),
  body("state").trim().isLength({ min: 2 }).withMessage("State is required"),
  body("zipCode")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Valid ZIP code is required"),
  body("country")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Country is required"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
];

const shippingMethodValidation = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Shipping method name is required"),
  body("cost")
    .isFloat({ min: 0 })
    .withMessage("Shipping cost must be a non-negative number"),
  body("estimatedDays")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Estimated delivery days is required"),
];

// All cart routes require authentication
router.use(protect);

// Cart management routes
router.get("/", getCart);
router.get("/summary", getCartSummary);
router.post("/add", addToCartValidation, addToCart);
router.put("/update", updateCartValidation, updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

// Coupon routes
router.post("/coupon", couponValidation, applyCoupon);
router.delete("/coupon", removeCoupon);

// Shipping routes
router.put("/shipping-address", shippingAddressValidation, setShippingAddress);
router.put("/shipping-method", shippingMethodValidation, setShippingMethod);

module.exports = router;
