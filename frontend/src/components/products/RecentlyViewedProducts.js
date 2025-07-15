import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiEye,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiClock,
} from "react-icons/fi";
import {
  removeFromRecentlyViewed,
  clearRecentlyViewed,
} from "../../features/recentlyViewed/recentlyViewedSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";
import CompareButton from "./CompareButton";

const RecentlyViewedProducts = ({ maxDisplay = 6, showTitle = true }) => {
  const dispatch = useDispatch();
  const { recentlyViewed } = useSelector((state) => state.recentlyViewed);
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
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      // Redirect to login
      return;
    }
    dispatch(addToWishlist(product.id));
  };

  const handleRemoveFromRecentlyViewed = (productId) => {
    dispatch(removeFromRecentlyViewed(productId));
  };

  const handleClearRecentlyViewed = () => {
    dispatch(clearRecentlyViewed());
  };

  const displayedProducts = recentlyViewed.slice(0, maxDisplay);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recently Viewed
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Products you've been looking at
              </p>
            </div>
          </div>
          <button
            onClick={handleClearRecentlyViewed}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300">
            <FiX className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden group">
              <div className="relative">
                <img
                  src={product.main_image || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  <button
                    onClick={() => handleRemoveFromRecentlyViewed(product.id)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {product.rating || 0}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <FiShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="p-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                    <FiHeart className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <CompareButton product={product} size="sm" showText={false} />
                  <Link
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                    <FiEye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {recentlyViewed.length > maxDisplay && (
        <div className="mt-6 text-center">
          <Link
            to="/recently-viewed"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <FiEye className="w-5 h-5" />
            <span>View All Recently Viewed ({recentlyViewed.length})</span>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default RecentlyViewedProducts;
