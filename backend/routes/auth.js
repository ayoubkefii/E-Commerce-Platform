const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAccount,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const {
  uploadSingle,
  handleUploadError,
  processUpload,
} = require("../middleware/upload");

// Validation middleware
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidation, updateProfile);
router.put(
  "/change-password",
  protect,
  changePasswordValidation,
  changePassword
);
router.post(
  "/avatar",
  protect,
  uploadSingle,
  handleUploadError,
  processUpload,
  uploadAvatar
);
router.delete("/account", protect, deleteAccount);

module.exports = router;
