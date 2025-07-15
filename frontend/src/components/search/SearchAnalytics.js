import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiSearch,
  FiClock,
  FiStar,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiBarChart3,
  FiPieChart,
  FiTarget,
  FiAward,
  FiZap,
  FiArrowUp,
  FiArrowDown,
  FiX,
} from "react-icons/fi";
import {
  getSearchAnalytics,
  getSearchInsights,
  setShowAnalytics,
  setShowInsights,
} from "../../features/search/searchSlice";

const SearchAnalytics = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { searchAnalytics, searchInsights, query, totalResults, results } =
    useSelector((state) => state.search);

  useEffect(() => {
    if (isOpen) {
      dispatch(getSearchAnalytics());
      if (query) {
        dispatch(getSearchInsights(query));
      }
    }
  }, [isOpen, query, dispatch]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}>
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <FiBarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Search Analytics & Insights
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Performance metrics and intelligent recommendations
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6">
              {/* Current Search Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Results</p>
                      <p className="text-2xl font-bold">{totalResults}</p>
                    </div>
                    <FiSearch className="w-8 h-8 text-blue-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Search Query</p>
                      <p className="text-lg font-semibold truncate">
                        {query || "No query"}
                      </p>
                    </div>
                    <FiTarget className="w-8 h-8 text-green-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Avg. Rating</p>
                      <p className="text-2xl font-bold">
                        {results.length > 0
                          ? (
                              results.reduce(
                                (acc, product) => acc + (product.rating || 0),
                                0
                              ) / results.length
                            ).toFixed(1)
                          : "N/A"}
                      </p>
                    </div>
                    <FiStar className="w-8 h-8 text-purple-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Avg. Price</p>
                      <p className="text-2xl font-bold">
                        $
                        {results.length > 0
                          ? (
                              results.reduce(
                                (acc, product) => acc + (product.price || 0),
                                0
                              ) / results.length
                            ).toFixed(0)
                          : "N/A"}
                      </p>
                    </div>
                    <FiDollarSign className="w-8 h-8 text-orange-200" />
                  </div>
                </div>
              </motion.div>

              {/* Analytics Overview */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Search Performance */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Search Performance
                    </h3>
                    <FiTrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Searches
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {searchAnalytics.totalSearches || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Conversion Rate
                      </span>
                      <span className="font-semibold text-green-600">
                        {searchAnalytics.conversionRates?.overall || "0%"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Avg. Search Time
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {searchAnalytics.userBehavior?.avgSearchTime || "0s"}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Popular Searches */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Popular Searches
                    </h3>
                    <FiZap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-3">
                    {(searchAnalytics.popularSearches || [])
                      .slice(0, 5)
                      .map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 truncate">
                            {search.query}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {search.count}
                          </span>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Search Insights */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Related Searches */}
                <motion.div
                  variants={cardVariants}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Related Searches
                    </h3>
                    <FiSearch className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    {(searchInsights.relatedSearches || [])
                      .slice(0, 6)
                      .map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded-lg cursor-pointer transition-colors">
                          <FiArrowUp className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {search}
                          </span>
                        </div>
                      ))}
                  </div>
                </motion.div>

                {/* Popular Categories */}
                <motion.div
                  variants={cardVariants}
                  className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Popular Categories
                    </h3>
                    <FiPieChart className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    {(searchInsights.popularCategories || [])
                      .slice(0, 6)
                      .map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-green-100 dark:hover:bg-green-800/30 rounded-lg cursor-pointer transition-colors">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {category.name}
                          </span>
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            {category.count}
                          </span>
                        </div>
                      ))}
                  </div>
                </motion.div>

                {/* Price Insights */}
                <motion.div
                  variants={cardVariants}
                  className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Price Insights
                    </h3>
                    <FiDollarSign className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Lowest Price
                      </span>
                      <span className="font-semibold text-green-600">
                        ${searchInsights.priceInsights?.lowest || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Highest Price
                      </span>
                      <span className="font-semibold text-red-600">
                        ${searchInsights.priceInsights?.highest || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Price Range
                      </span>
                      <span className="font-semibold text-purple-600">
                        ${searchInsights.priceInsights?.range || "N/A"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Recommendations */}
              <motion.div variants={itemVariants}>
                <motion.div
                  variants={cardVariants}
                  className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI Recommendations
                    </h3>
                    <FiAward className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(searchInsights.recommendations || [])
                      .slice(0, 4)
                      .map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <FiZap className="w-4 h-4 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {rec.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchAnalytics;
