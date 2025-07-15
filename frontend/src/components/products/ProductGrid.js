import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import ProductList from "./ProductList";
import { FiPackage, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const ProductGrid = ({ products, loading, error, viewMode = "grid" }) => {
  if (loading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }>
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="flex space-x-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
            Error loading products
          </div>
          <p className="text-red-500 dark:text-red-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300">
            <FiRefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </motion.div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-md mx-auto">
          <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 dark:text-gray-400 text-lg font-semibold mb-2">
            No products found
          </div>
          <p className="text-gray-400 dark:text-gray-500 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300">
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // Render based on view mode
  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id || product._id || product.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <ProductList product={product} />
          </motion.div>
        ))}
      </div>
    );
  }

  // Default grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id || product._id || product.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
