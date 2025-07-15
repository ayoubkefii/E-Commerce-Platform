import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";

// Components
import Layout from "../components/layout/Layout";
import ProductGrid from "../components/products/ProductGrid";

// Redux
import {
  getProducts,
  getCategories,
  getBrands,
  setFilters,
  clearFilters as clearFiltersAction,
} from "../features/products/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    products,
    categories,
    brands,
    pagination,
    filters,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.products);

  // Initialize filters from URL params and fetch initial data
  useEffect(() => {
    const urlFilters = {
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "",
      page: searchParams.get("page") || "1",
    };
    dispatch(setFilters(urlFilters));
    setSearchTerm(urlFilters.search);

    // Fetch categories and brands if not already loaded
    if (categories.length === 0) {
      dispatch(getCategories());
    }
    if (brands.length === 0) {
      dispatch(getBrands());
    }
  }, [dispatch, searchParams, categories.length, brands.length]);

  // Fetch products when filters change
  useEffect(() => {
    const activeFilters = { ...filters };
    // Remove empty filters
    Object.keys(activeFilters).forEach((key) => {
      if (!activeFilters[key]) delete activeFilters[key];
    });
    dispatch(getProducts(activeFilters));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm, page: "1" }));
    updateURL({ search: searchTerm, page: "1" });
  };

  const clearFilters = () => {
    dispatch(clearFiltersAction());
    setSearchTerm("");
    setSearchParams({});
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: "1" }));
    updateURL({ [key]: value, page: "1" });
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ page: page.toString() }));
    updateURL({ page: page.toString() });
  };

  const updateURL = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };
    // Remove empty values
    Object.keys(updated).forEach((key) => {
      if (!updated[key]) delete updated[key];
    });
    setSearchParams(updated);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.search) count++;
    if (filters.sort) count++;
    return count;
  };

  const sortOptions = [
    { value: "", label: "Latest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
    { value: "name", label: "Name" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              All Products
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover our collection of amazing products
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <form
                  onSubmit={handleSearch}
                  className="flex-1 max-w-md w-full">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    />
                  </div>
                </form>

                {/* View Mode and Filter Toggle */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}>
                      <FiGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}>
                      <FiList className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <FiFilter className="w-4 h-4" />
                    <span>Filters</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Category
                        </label>
                        <select
                          value={filters.category}
                          onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300">
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Brand Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Brand
                        </label>
                        <select
                          value={filters.brand}
                          onChange={(e) =>
                            handleFilterChange("brand", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300">
                          <option value="">All Brands</option>
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Min Price
                        </label>
                        <input
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) =>
                            handleFilterChange("minPrice", e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Max Price
                        </label>
                        <input
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            handleFilterChange("maxPrice", e.target.value)
                          }
                          placeholder="1000"
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Sort and Clear */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Sort by:
                        </label>
                        <select
                          value={filters.sort}
                          onChange={(e) =>
                            handleFilterChange("sort", e.target.value)
                          }
                          className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300">
                          {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={clearFilters}
                        className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300">
                        <FiX className="w-4 h-4" />
                        <span>Clear Filters</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <span>Loading products...</span>
                ) : (
                  <span>
                    Showing {products.length} of {pagination.total} products
                  </span>
                )}
              </div>
              {getActiveFiltersCount() > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.category && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                      Category: {filters.category}
                    </span>
                  )}
                  {filters.brand && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
                      Brand: {filters.brand}
                    </span>
                  )}
                  {filters.search && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full">
                      Search: {filters.search}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}>
            <ProductGrid
              products={products}
              loading={isLoading}
              error={isError}
              viewMode={viewMode}
            />
          </motion.div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  Previous
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        page === pagination.page
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-500 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}>
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  Next
                </button>
              </nav>
            </motion.div>
          )}

          {/* Error State */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
                <div className="text-red-500 text-xl font-semibold mb-4">
                  Error loading products
                </div>
                <p className="text-red-600 dark:text-red-400 mb-6">{message}</p>
                <button
                  onClick={() => dispatch(getProducts(filters))}
                  className="flex items-center space-x-2 mx-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300">
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
