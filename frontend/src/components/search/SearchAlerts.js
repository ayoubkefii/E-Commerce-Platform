import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiPlus,
  FiX,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiStar,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiSettings,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import {
  addToSearchAlerts,
  removeFromSearchAlerts,
  clearSearchAlerts,
} from "../../features/search/searchSlice";

const SearchAlerts = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { searchAlerts, filters, query } = useSelector((state) => state.search);

  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: "",
    query: query || "",
    filters: { ...filters },
    frequency: "daily", // daily, weekly, monthly
    email: true,
    push: false,
    priceChange: false,
    newProducts: true,
    onSale: false,
  });

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

  const handleCreateAlert = () => {
    if (newAlert.name && newAlert.query) {
      const alert = {
        id: Date.now().toString(),
        ...newAlert,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      dispatch(addToSearchAlerts(alert));
      setNewAlert({
        name: "",
        query: query || "",
        filters: { ...filters },
        frequency: "daily",
        email: true,
        push: false,
        priceChange: false,
        newProducts: true,
        onSale: false,
      });
      setIsCreating(false);
    }
  };

  const handleDeleteAlert = (alertId) => {
    dispatch(removeFromSearchAlerts(alertId));
  };

  const handleToggleAlert = (alert) => {
    const updatedAlert = { ...alert, isActive: !alert.isActive };
    dispatch(removeFromSearchAlerts(alert.id));
    dispatch(addToSearchAlerts(updatedAlert));
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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <FiBell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Search Alerts
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Stay updated with your favorite searches
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <FiPlus className="w-4 h-4" />
                  <span>New Alert</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6">
              {/* Create New Alert */}
              <AnimatePresence>
                {isCreating && (
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Create New Search Alert
                      </h3>
                      <button
                        onClick={() => setIsCreating(false)}
                        className="p-1 hover:bg-orange-100 dark:hover:bg-orange-800/30 rounded-lg transition-colors">
                        <FiX className="w-5 h-5 text-orange-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Alert Name
                        </label>
                        <input
                          type="text"
                          value={newAlert.name}
                          onChange={(e) =>
                            setNewAlert({ ...newAlert, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g., iPhone deals"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Search Query
                        </label>
                        <input
                          type="text"
                          value={newAlert.query}
                          onChange={(e) =>
                            setNewAlert({ ...newAlert, query: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g., iPhone 15"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Frequency
                        </label>
                        <select
                          value={newAlert.frequency}
                          onChange={(e) =>
                            setNewAlert({
                              ...newAlert,
                              frequency: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Price
                        </label>
                        <input
                          type="number"
                          value={newAlert.filters.priceRange.max}
                          onChange={(e) =>
                            setNewAlert({
                              ...newAlert,
                              filters: {
                                ...newAlert.filters,
                                priceRange: {
                                  ...newAlert.filters.priceRange,
                                  max: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="1000"
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAlert.email}
                            onChange={(e) =>
                              setNewAlert({
                                ...newAlert,
                                email: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Email notifications
                          </span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAlert.push}
                            onChange={(e) =>
                              setNewAlert({
                                ...newAlert,
                                push: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Push notifications
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAlert.priceChange}
                            onChange={(e) =>
                              setNewAlert({
                                ...newAlert,
                                priceChange: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Price changes
                          </span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAlert.newProducts}
                            onChange={(e) =>
                              setNewAlert({
                                ...newAlert,
                                newProducts: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            New products
                          </span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAlert.onSale}
                            onChange={(e) =>
                              setNewAlert({
                                ...newAlert,
                                onSale: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            On sale items
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setIsCreating(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateAlert}
                        disabled={!newAlert.name || !newAlert.query}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        Create Alert
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Existing Alerts */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Search Alerts ({searchAlerts.length})
                  </h3>
                  {searchAlerts.length > 0 && (
                    <button
                      onClick={() => dispatch(clearSearchAlerts())}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      Clear All
                    </button>
                  )}
                </div>

                {searchAlerts.length === 0 ? (
                  <motion.div
                    variants={cardVariants}
                    className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <FiBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No search alerts yet
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first search alert to stay updated with new
                      products and price changes
                    </p>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200">
                      <FiPlus className="w-4 h-4" />
                      <span>Create Alert</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {searchAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        variants={cardVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {alert.name}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  alert.isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}>
                                {alert.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-2">
                                <FiSearch className="w-4 h-4" />
                                <span>{alert.query}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FiClock className="w-4 h-4" />
                                <span className="capitalize">
                                  {alert.frequency}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FiDollarSign className="w-4 h-4" />
                                <span>
                                  Max: ${alert.filters.priceRange.max}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FiStar className="w-4 h-4" />
                                <span>
                                  Created:{" "}
                                  {new Date(
                                    alert.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {alert.email && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                                  Email
                                </span>
                              )}
                              {alert.push && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-full">
                                  Push
                                </span>
                              )}
                              {alert.priceChange && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                                  Price Changes
                                </span>
                              )}
                              {alert.newProducts && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-xs rounded-full">
                                  New Products
                                </span>
                              )}
                              {alert.onSale && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full">
                                  On Sale
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleToggleAlert(alert)}
                              className={`p-2 rounded-lg transition-colors ${
                                alert.isActive
                                  ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                                  : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}>
                              {alert.isActive ? (
                                <FiEye className="w-4 h-4" />
                              ) : (
                                <FiEyeOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchAlerts;
