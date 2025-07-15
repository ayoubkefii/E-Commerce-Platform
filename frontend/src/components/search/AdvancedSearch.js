import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiMic,
  FiMicOff,
  FiCamera,
  FiTrendingUp,
  FiClock,
  FiStar,
  FiGrid,
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiSliders,
  FiDollarSign,
  FiTag,
  FiCheck,
  FiEye,
  FiShoppingCart,
  FiHeart,
  FiBarChart3,
  FiBell,
  FiDownload,
  FiSettings,
} from "react-icons/fi";
import {
  setQuery,
  clearQuery,
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches,
  setPriceRange,
  setBrands,
  setCategories,
  setRatings,
  setAvailability,
  setSortBy,
  setViewMode,
  clearFilters,
  toggleFilters,
  setSearchFocused,
  setShowSuggestions,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
  setShowAnalytics,
  setShowInsights,
} from "../../features/search/searchSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";
import CompareButton from "../products/CompareButton";
import SearchAnalytics from "./SearchAnalytics";
import SearchAlerts from "./SearchAlerts";
import SearchExport from "./SearchExport";

const AdvancedSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const {
    query,
    results,
    totalResults,
    isLoading,
    isError,
    message,
    filters,
    suggestions,
    trendingSearches,
    searchHistory,
    isFiltersOpen,
    isSearchFocused,
    showSuggestions,
  } = useSelector((state) => state.search);

  const { user } = useSelector((state) => state.auth);

  // Sample data for filters (replace with API data)
  const availableBrands = [
    "Apple",
    "Samsung",
    "Sony",
    "LG",
    "Dell",
    "HP",
    "Nike",
    "Adidas",
  ];
  const availableCategories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
  ];
  const ratingOptions = [5, 4, 3, 2, 1];

  useEffect(() => {
    // Load trending searches on component mount
    dispatch(getTrendingSearches());
  }, [dispatch]);

  useEffect(() => {
    // Debounced search suggestions
    if (query.length >= 2) {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        dispatch(getSearchSuggestions(query));
      }, 300);
      setDebounceTimer(timer);
    } else {
      dispatch(setShowSuggestions(false));
    }

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [query, dispatch, debounceTimer]);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      const searchParams = {
        q: searchQuery,
        ...filters,
        priceMin: filters.priceRange.min,
        priceMax: filters.priceRange.max,
      };
      dispatch(searchProducts(searchParams));
      dispatch(addToSearchHistory(searchQuery));
      dispatch(setShowSuggestions(false));
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (
        selectedSuggestionIndex >= 0 &&
        suggestions[selectedSuggestionIndex]
      ) {
        const selectedSuggestion = suggestions[selectedSuggestionIndex];
        dispatch(setQuery(selectedSuggestion));
        handleSearch(selectedSuggestion);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : -1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > -1 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Escape") {
      dispatch(setShowSuggestions(false));
      dispatch(setSearchFocused(false));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setQuery(suggestion));
    handleSearch(suggestion);
  };

  const handleHistoryClick = (historyItem) => {
    dispatch(setQuery(historyItem));
    handleSearch(historyItem);
  };

  const handleTrendingClick = (trendingItem) => {
    dispatch(setQuery(trendingItem));
    handleSearch(trendingItem);
  };

  const handleVoiceSearch = () => {
    if (!isListening) {
      setIsListening(true);
      // Voice recognition implementation would go here
      // For now, we'll simulate it
      setTimeout(() => {
        setIsListening(false);
        const voiceQuery = "wireless headphones";
        dispatch(setQuery(voiceQuery));
        handleSearch(voiceQuery);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleVisualSearch = () => {
    // Visual search implementation would go here
    alert("Visual search feature coming soon!");
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    dispatch(addToWishlist(product.id));
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.brands.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.ratings.length > 0) count++;
    if (filters.availability !== "all") count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="relative max-w-4xl mx-auto">
            {/* Main Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                onFocus={() => {
                  dispatch(setSearchFocused(true));
                  dispatch(setShowSuggestions(true));
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search for products, brands, categories..."
                className="block w-full pl-12 pr-20 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
                {query && (
                  <button
                    onClick={() => dispatch(clearQuery())}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <FiX className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}>
                  {isListening ? (
                    <FiMicOff className="h-5 w-5" />
                  ) : (
                    <FiMic className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={handleVisualSearch}
                  className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <FiCamera className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleSearch()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
                  Search
                </button>
              </div>
            </div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions &&
                (isSearchFocused || suggestions.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <FiSearch className="w-4 h-4 mr-2" />
                          Suggestions
                        </h3>
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              index === selectedSuggestionIndex
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}>
                            <div className="flex items-center">
                              <FiSearch className="w-4 h-4 mr-3 text-gray-400" />
                              <span>{suggestion}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Search History */}
                    {searchHistory.length > 0 && (
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                            <FiClock className="w-4 h-4 mr-2" />
                            Recent Searches
                          </h3>
                          <button
                            onClick={() => dispatch(clearSearchHistory())}
                            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400">
                            Clear All
                          </button>
                        </div>
                        {searchHistory.slice(0, 5).map((historyItem, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <button
                              onClick={() => handleHistoryClick(historyItem)}
                              className="flex items-center flex-1 text-left text-gray-700 dark:text-gray-300">
                              <FiClock className="w-4 h-4 mr-3 text-gray-400" />
                              <span>{historyItem}</span>
                            </button>
                            <button
                              onClick={() =>
                                dispatch(removeFromSearchHistory(historyItem))
                              }
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Trending Searches */}
                    {trendingSearches.length > 0 && (
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <FiTrendingUp className="w-4 h-4 mr-2" />
                          Trending Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches
                            .slice(0, 8)
                            .map((trendingItem, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleTrendingClick(trendingItem)
                                }
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                {trendingItem}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Filters and Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sticky top-24">
              {/* Filters Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FiSliders className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400">
                  Clear All
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <FiDollarSign className="w-4 h-4 mr-2" />
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        dispatch(
                          setPriceRange({
                            ...filters.priceRange,
                            min: parseInt(e.target.value) || 0,
                          })
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        dispatch(
                          setPriceRange({
                            ...filters.priceRange,
                            max: parseInt(e.target.value) || 1000,
                          })
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((filters.priceRange.max - filters.priceRange.min) /
                            1000) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <FiTag className="w-4 h-4 mr-2" />
                  Brands
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            dispatch(setBrands([...filters.brands, brand]));
                          } else {
                            dispatch(
                              setBrands(
                                filters.brands.filter((b) => b !== brand)
                              )
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Categories
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            dispatch(
                              setCategories([...filters.categories, category])
                            );
                          } else {
                            dispatch(
                              setCategories(
                                filters.categories.filter((c) => c !== category)
                              )
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <FiStar className="w-4 h-4 mr-2" />
                  Rating
                </h3>
                <div className="space-y-2">
                  {ratingOptions.map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.ratings.includes(rating)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            dispatch(setRatings([...filters.ratings, rating]));
                          } else {
                            dispatch(
                              setRatings(
                                filters.ratings.filter((r) => r !== rating)
                              )
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <FiStar
                            key={index}
                            className={`w-4 h-4 ${
                              index < rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        & up
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Availability
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Products" },
                    { value: "inStock", label: "In Stock" },
                    { value: "outOfStock", label: "Out of Stock" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={filters.availability === option.value}
                        onChange={(e) =>
                          dispatch(setAvailability(e.target.value))
                        }
                        className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Search Results
                  </h1>
                  {query && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {totalResults} results for "{query}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Advanced Search Actions */}
                  {results.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowAnalytics(true)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm">
                        <FiBarChart3 className="w-4 h-4" />
                        <span>Analytics</span>
                      </button>
                      <button
                        onClick={() => setShowAlerts(true)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 text-sm">
                        <FiBell className="w-4 h-4" />
                        <span>Alerts</span>
                      </button>
                      <button
                        onClick={() => setShowExport(true)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 text-sm">
                        <FiDownload className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  )}

                  {/* Sort Options */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => dispatch(setSortBy(e.target.value))}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="relevance">Sort by Relevance</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => dispatch(setViewMode("grid"))}
                      className={`p-2 rounded-md transition-colors ${
                        filters.viewMode === "grid"
                          ? "bg-white dark:bg-gray-600 text-blue-500 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}>
                      <FiGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => dispatch(setViewMode("list"))}
                      className={`p-2 rounded-md transition-colors ${
                        filters.viewMode === "list"
                          ? "bg-white dark:bg-gray-600 text-blue-500 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}>
                      <FiList className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiRefreshCw className="w-4 h-4 text-white" />
                </motion.div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Searching...
                </span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <p className="text-red-600 dark:text-red-400">{message}</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Try Again
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && !isError && results.length > 0 && (
              <div
                className={`grid gap-6 ${
                  filters.viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}>
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden group ${
                      filters.viewMode === "list" ? "flex" : ""
                    }`}>
                    {/* Product Image */}
                    <div
                      className={`relative ${
                        filters.viewMode === "list" ? "w-48" : ""
                      }`}>
                      <img
                        src={product.main_image || product.images?.[0]}
                        alt={product.name}
                        className={`object-cover group-hover:scale-110 transition-transform duration-300 ${
                          filters.viewMode === "list"
                            ? "w-full h-full"
                            : "w-full h-48"
                        }`}
                      />
                      <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {product.rating || 0}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div
                      className={`p-4 ${
                        filters.viewMode === "list" ? "flex-1" : ""
                      }`}>
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
                        <CompareButton
                          product={product}
                          size="sm"
                          showText={false}
                        />
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                          <FiEye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && !isError && results.length === 0 && query && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnimatePresence>
        <SearchAnalytics
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      </AnimatePresence>

      {/* Alerts Modal */}
      <AnimatePresence>
        <SearchAlerts
          isOpen={showAlerts}
          onClose={() => setShowAlerts(false)}
        />
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        <SearchExport
          isOpen={showExport}
          onClose={() => setShowExport(false)}
        />
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
