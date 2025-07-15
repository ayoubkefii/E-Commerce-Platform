import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDownload,
  FiX,
  FiFileText,
  FiFile,
  FiGrid,
  FiList,
  FiCheck,
  FiAlertCircle,
  FiSettings,
  FiFilter,
  FiSearch,
  FiDollarSign,
  FiStar,
  FiClock,
  FiEye,
  FiShare2,
  FiMail,
  FiPrinter,
} from "react-icons/fi";
import {
  exportSearchResults,
  setIsExporting,
  setExportError,
} from "../../features/search/searchSlice";

const SearchExport = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { results, totalResults, query, filters, isExporting, exportError } =
    useSelector((state) => state.search);

  const [exportConfig, setExportConfig] = useState({
    format: "csv", // csv, pdf, excel
    includeImages: false,
    includeDescription: true,
    includeReviews: false,
    includePricing: true,
    includeAvailability: true,
    columns: ["name", "price", "rating", "category", "brand"],
    fileName: `search_results_${new Date().toISOString().split("T")[0]}`,
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

  const handleExport = async () => {
    if (results.length === 0) {
      dispatch(setExportError("No results to export"));
      return;
    }

    const searchParams = {
      q: query,
      ...filters,
      priceMin: filters.priceRange.min,
      priceMax: filters.priceRange.max,
    };

    try {
      await dispatch(
        exportSearchResults({ format: exportConfig.format, searchParams })
      ).unwrap();
      // Handle successful export (download file)
      console.log("Export completed successfully");
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const availableColumns = [
    { id: "name", label: "Product Name", icon: FiFileText },
    { id: "price", label: "Price", icon: FiDollarSign },
    { id: "rating", label: "Rating", icon: FiStar },
    { id: "category", label: "Category", icon: FiGrid },
    { id: "brand", label: "Brand", icon: FiFile },
    { id: "description", label: "Description", icon: FiFileText },
    { id: "availability", label: "Availability", icon: FiEye },
    { id: "reviews", label: "Reviews Count", icon: FiStar },
    { id: "dateAdded", label: "Date Added", icon: FiClock },
  ];

  const toggleColumn = (columnId) => {
    setExportConfig((prev) => ({
      ...prev,
      columns: prev.columns.includes(columnId)
        ? prev.columns.filter((id) => id !== columnId)
        : [...prev.columns, columnId],
    }));
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
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                  <FiDownload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Export Search Results
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Export {totalResults} results in your preferred format
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
              {/* Export Summary */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-green-100 text-sm">Query</p>
                      <p className="text-lg font-semibold truncate">
                        {query || "All products"}
                      </p>
                    </div>
                    <FiFileText className="w-8 h-8 text-green-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Format</p>
                      <p className="text-lg font-semibold uppercase">
                        {exportConfig.format}
                      </p>
                    </div>
                    <FiDownload className="w-8 h-8 text-purple-200" />
                  </div>
                </div>
              </motion.div>

              {/* Export Configuration */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Format and Basic Settings */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Export Settings
                    </h3>
                    <FiSettings className="w-5 h-5 text-gray-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Export Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["csv", "pdf", "excel"].map((format) => (
                          <button
                            key={format}
                            onClick={() =>
                              setExportConfig({ ...exportConfig, format })
                            }
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              exportConfig.format === format
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                            }`}>
                            <div className="text-center">
                              <div className="text-lg font-semibold uppercase">
                                {format}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {format === "csv" && "Comma separated"}
                                {format === "pdf" && "Portable document"}
                                {format === "excel" && "Spreadsheet"}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={exportConfig.fileName}
                        onChange={(e) =>
                          setExportConfig({
                            ...exportConfig,
                            fileName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="export_filename"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeDescription}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              includeDescription: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Include product descriptions
                        </span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeReviews}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              includeReviews: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Include review counts
                        </span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportConfig.includePricing}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              includePricing: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Include pricing information
                        </span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeAvailability}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              includeAvailability: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Include availability status
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Column Selection */}
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Select Columns
                    </h3>
                    <FiGrid className="w-5 h-5 text-gray-500" />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableColumns.map((column) => {
                      const Icon = column.icon;
                      const isSelected = exportConfig.columns.includes(
                        column.id
                      );

                      return (
                        <button
                          key={column.id}
                          onClick={() => toggleColumn(column.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                          }`}>
                          <div className="flex items-center space-x-3">
                            <Icon
                              className={`w-4 h-4 ${
                                isSelected ? "text-green-600" : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                isSelected
                                  ? "text-green-700 dark:text-green-300"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}>
                              {column.label}
                            </span>
                          </div>
                          {isSelected && (
                            <FiCheck className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>

              {/* Export Actions */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <FiMail className="w-4 h-4" />
                    <span>Email Export</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <FiPrinter className="w-4 h-4" />
                    <span>Print Preview</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <FiShare2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting || results.length === 0}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                    <FiDownload className="w-4 h-4" />
                    <span>
                      {isExporting ? "Exporting..." : "Export Results"}
                    </span>
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {exportError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 dark:text-red-300">
                      {exportError}
                    </span>
                    <button
                      onClick={() => dispatch(setExportError(null))}
                      className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-lg transition-colors">
                      <FiX className="w-4 h-4 text-red-500" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchExport;
