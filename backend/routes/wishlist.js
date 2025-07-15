const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { protect } = require("../middleware/auth");

// Get all wishlist items
router.get("/", protect, wishlistController.getWishlist);
// Add to wishlist
router.post("/add", protect, wishlistController.addToWishlist);
// Remove from wishlist
router.delete(
  "/remove/:productId",
  protect,
  wishlistController.removeFromWishlist
);
// Clear wishlist
router.delete("/clear", protect, wishlistController.clearWishlist);
// Check if product is in wishlist
router.get("/check/:productId", protect, wishlistController.checkWishlist);

module.exports = router;
