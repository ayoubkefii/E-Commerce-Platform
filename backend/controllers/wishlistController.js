const { sequelize } = require("../config/database");
const WishlistFactory = require("../models/Wishlist");
const Product = require("../models/Product");
const User = require("../models/User");

// Initialize Wishlist with sequelize
const Wishlist = WishlistFactory(sequelize);

// Get all wishlist items for the logged-in user
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await Wishlist.findAll({
      where: { user_id: userId },
    });

    // Manually fetch product details for each wishlist item
    const items = [];
    for (const item of wishlistItems) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        items.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          compare_price: product.compare_price,
          category: product.category,
          subcategory: product.subcategory,
          brand: product.brand,
          main_image: product.main_image,
          stock: product.stock,
          sku: product.sku,
          weight: product.weight,
          tags: product.tags,
          specifications: product.specifications,
          average_rating: product.average_rating,
          num_reviews: product.num_reviews,
          is_active: product.is_active,
          is_featured: product.is_featured,
          discount: product.discount,
          free_shipping: product.free_shipping,
          created_at: product.created_at,
          updated_at: product.updated_at,
        });
      }
    }

    res.json({ items });
  } catch (error) {
    console.error("Wishlist error:", error);
    res
      .status(500)
      .json({ message: "Failed to get wishlist", error: error.message });
  }
};

// Add a product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    console.log("Adding to wishlist:", { userId, productId });

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicates
    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: { user_id: userId, product_id: productId },
    });

    console.log("Wishlist item created:", created);

    // Return updated wishlist
    req.user = { id: userId }; // for getWishlist
    return exports.getWishlist(req, res);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res
      .status(500)
      .json({ message: "Failed to add to wishlist", error: error.message });
  }
};

// Remove a product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    console.log("Removing from wishlist:", { userId, productId });

    const deleted = await Wishlist.destroy({
      where: { user_id: userId, product_id: productId },
    });

    console.log("Wishlist items deleted:", deleted);

    req.user = { id: userId }; // for getWishlist
    return exports.getWishlist(req, res);
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({
      message: "Failed to remove from wishlist",
      error: error.message,
    });
  }
};

// Clear all wishlist items for the user
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    await Wishlist.destroy({ where: { user_id: userId } });
    res.json({ items: [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to clear wishlist", error: error.message });
  }
};

// Check if a product is in the user's wishlist
exports.checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const exists = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });
    res.json({ inWishlist: !!exists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to check wishlist", error: error.message });
  }
};
