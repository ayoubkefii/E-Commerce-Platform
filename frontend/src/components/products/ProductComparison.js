import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiX,
  FiTrash2,
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiCheck,
  FiX as FiClose,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import {
  addToCart,
  addToWishlist,
  removeFromComparison,
  clearComparison,
  closeComparison,
} from "../../features/comparison/comparisonSlice";
import { addToCart as addToCartAction } from "../../features/cart/cartSlice";
import { addToWishlist as addToWishlistAction } from "../../features/wishlist/wishlistSlice";

const ProductComparison = () => {
  const dispatch = useDispatch();
  const { comparisonItems, isComparisonOpen } = useSelector(
    (state) => state.comparison
  );
  const { user } = useSelector((state) => state.auth);

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      // Redirect to login
      return;
    }
    dispatch(addToCartAction({ productId: product.id, quantity: 1 }));
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      // Redirect to login
      return;
    }
    dispatch(addToWishlistAction(product.id));
  };

  const handleRemoveFromComparison = (productId) => {
    dispatch(removeFromComparison(productId));
  };

  const handleClearComparison = () => {
    dispatch(clearComparison());
  };

  const handleCloseComparison = () => {
    dispatch(closeComparison());
  };

  if (!isComparisonOpen || comparisonItems.length === 0) {
    return null;
  }

  // Define comparison attributes
  const comparisonAttributes = [
    { key: "price", label: "Price", type: "price" },
    { key: "rating", label: "Rating", type: "rating" },
    { key: "reviews_count", label: "Reviews", type: "number" },
    { key: "stock", label: "Availability", type: "stock" },
    { key: "brand", label: "Brand", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "features", label: "Features", type: "list" },
  ];

  const getAttributeValue = (product, attribute) => {
    switch (attribute.type) {
      case "price":
        return formatPrice(product[attribute.key]);
      case "rating":
        return product[attribute.key] ? `${product[attribute.key]}/5` : "N/A";
      case "stock":
        return product[attribute.key] > 0 ? "In Stock" : "Out of Stock";
      case "list":
        return product[attribute.key] || [];
      default:
        return product[attribute.key] || "N/A";
    }
  };

  const renderAttributeValue = (product, attribute) => {
    const value = getAttributeValue(product, attribute);

    switch (attribute.type) {
      case "rating":
        return (
          <div className="flex items-center space-x-1">
            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{value}</span>
          </div>
        );
      case "list":
        return (
          <ul className="text-sm space-y-1">
            {Array.isArray(value) && value.length > 0 ? (
              value.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <FiCheck className="w-3 h-3 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))
            ) : (
              <span className="text-gray-400">No features listed</span>
            )}
          </ul>
        );
      default:
        return <span className="text-sm">{value}</span>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleCloseComparison}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Product Comparison
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Compare {comparisonItems.length} products
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearComparison}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300">
                <FiTrash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
              <button
                onClick={handleCloseComparison}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300">
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Product Headers */}
              <div className="grid grid-cols-1 gap-4 p-6">
                {comparisonItems.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={product.main_image || product.images?.[0]}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          onClick={() => handleRemoveFromComparison(product.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                          <FiClose className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {product.rating || 0}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({product.reviews_count || 0} reviews)
                          </span>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {formatPrice(product.price)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <FiShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            onClick={() => handleAddToWishlist(product)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                            <FiHeart className="w-4 h-4" />
                            <span>Wishlist</span>
                          </button>
                          <Link
                            to={`/product/${product.id}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                            <FiMaximize2 className="w-4 h-4" />
                            <span>View Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Comparison Attributes */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                {comparisonAttributes.map((attribute, index) => (
                  <div
                    key={attribute.key}
                    className="grid grid-cols-1 gap-4 p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">
                      {attribute.label}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {comparisonItems.map((product) => (
                        <div
                          key={`${product.id}-${attribute.key}`}
                          className="text-gray-600 dark:text-gray-400">
                          {renderAttributeValue(product, attribute)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductComparison;
