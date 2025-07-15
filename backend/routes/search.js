const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches,
  getSearchAnalytics,
  getSearchInsights,
  exportSearchResults,
} = require("../controllers/searchController");

// Search products with advanced filters
router.get("/products", searchProducts);

// Get search suggestions
router.get("/suggestions", getSearchSuggestions);

// Get trending searches
router.get("/trending", getTrendingSearches);

// Get search analytics (protected)
router.get("/analytics", protect, getSearchAnalytics);

// Get search insights
router.get("/insights", getSearchInsights);

// Export search results (protected)
router.get("/export", protect, exportSearchResults);

module.exports = router;
