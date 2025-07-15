const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getCategories,
  getBrands,
  getProductQuestions,
  askProductQuestion,
  answerProductQuestion,
  addAnswerToQuestion,
  deleteProductQuestion,
  deleteAnswer,
} = require("../controllers/productController");

const { protect, admin, optionalAuth } = require("../middleware/auth");
const {
  uploadMultiple,
  uploadProductImages,
  handleUploadError,
  processUpload,
} = require("../middleware/upload");

// Validation middleware
const productValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isIn([
      "Electronics",
      "Clothing",
      "Books",
      "Home & Garden",
      "Sports",
      "Beauty",
      "Toys",
      "Automotive",
      "Health",
      "Food",
    ])
    .withMessage("Invalid category"),
  body("brand")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Brand must be between 1 and 50 characters"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
];

const reviewValidation = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Review comment must be between 10 and 500 characters"),
];

// Public routes
router.get("/", optionalAuth, getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/category/:category", getProductsByCategory);
router.get("/latest", require("../controllers/productController").getLatestProducts);
router.get("/top-rated", require("../controllers/productController").getTopRatedProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/:id/reviews", protect, reviewValidation, addProductReview);
router.put(
  "/:id/reviews/:reviewId",
  protect,
  reviewValidation,
  updateProductReview
);
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

// Q&A routes
router.get("/:id/questions", getProductQuestions);
router.post("/:id/questions", protect, askProductQuestion);
router.put(
  "/:id/questions/:questionId/answer",
  protect,
  admin,
  answerProductQuestion
);
router.post("/:id/questions/:questionId/answers", protect, addAnswerToQuestion);
router.delete("/:id/questions/:questionId", protect, deleteProductQuestion);
router.delete(
  "/:id/questions/:questionId/answers/:answerId",
  protect,
  deleteAnswer
);

// Admin routes
router.post(
  "/",
  protect,
  admin,
  uploadProductImages,
  handleUploadError,
  processUpload,
  productValidation,
  createProduct
);
router.put(
  "/:id",
  protect,
  admin,
  uploadProductImages,
  handleUploadError,
  processUpload,
  productValidation,
  updateProduct
);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
