import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Load search history from localStorage
const loadSearchHistory = () => {
  try {
    const stored = localStorage.getItem("searchHistory");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading search history:", error);
    return [];
  }
};

// Load search alerts from localStorage
const loadSearchAlerts = () => {
  try {
    const stored = localStorage.getItem("searchAlerts");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading search alerts:", error);
    return [];
  }
};

// Save search history to localStorage
const saveSearchHistory = (history) => {
  try {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
};

// Save search alerts to localStorage
const saveSearchAlerts = (alerts) => {
  try {
    localStorage.setItem("searchAlerts", JSON.stringify(alerts));
  } catch (error) {
    console.error("Error saving search alerts:", error);
  }
};

// Search products with filters
export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async (searchParams, thunkAPI) => {
    try {
      const response = await api.get("/search/products", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get search suggestions
export const getSearchSuggestions = createAsyncThunk(
  "search/getSearchSuggestions",
  async (query, thunkAPI) => {
    try {
      const response = await api.get(`/search/suggestions?q=${query}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get trending searches
export const getTrendingSearches = createAsyncThunk(
  "search/getTrendingSearches",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/search/trending");
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get search analytics
export const getSearchAnalytics = createAsyncThunk(
  "search/getSearchAnalytics",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/search/analytics");
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get search insights
export const getSearchInsights = createAsyncThunk(
  "search/getSearchInsights",
  async (query, thunkAPI) => {
    try {
      const response = await api.get(`/search/insights?q=${query}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Export search results
export const exportSearchResults = createAsyncThunk(
  "search/exportSearchResults",
  async ({ format, searchParams }, thunkAPI) => {
    try {
      const response = await api.get("/search/export", {
        params: { format, ...searchParams },
        responseType: "blob",
      });
      return { data: response.data, format };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  // Search state
  query: "",
  results: [],
  totalResults: 0,
  isLoading: false,
  isError: false,
  message: "",

  // Filters
  filters: {
    priceRange: { min: 0, max: 1000 },
    brands: [],
    categories: [],
    ratings: [],
    availability: "all", // all, inStock, outOfStock
    sortBy: "relevance", // relevance, priceLow, priceHigh, rating, newest
    viewMode: "grid", // grid, list
    // Advanced filters
    dateRange: { start: null, end: null },
    location: "",
    tags: [],
    features: [],
    condition: "all", // all, new, used, refurbished
    warranty: "all", // all, yes, no
    freeShipping: false,
    onSale: false,
  },

  // Search suggestions
  suggestions: [],
  trendingSearches: [],

  // Search history
  searchHistory: loadSearchHistory(),
  maxHistoryItems: 10,

  // Search alerts
  searchAlerts: loadSearchAlerts(),
  maxAlertsItems: 5,

  // UI state
  isFiltersOpen: false,
  isSearchFocused: false,
  showSuggestions: false,
  showAnalytics: false,
  showInsights: false,

  // Analytics
  searchAnalytics: {
    totalSearches: 0,
    popularSearches: [],
    searchPerformance: {},
    userBehavior: {},
    conversionRates: {},
  },

  // Search insights
  searchInsights: {
    relatedSearches: [],
    popularCategories: [],
    trendingProducts: [],
    priceInsights: {},
    recommendations: [],
  },

  // Export state
  isExporting: false,
  exportError: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Search actions
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "";
    },
    clearResults: (state) => {
      state.results = [];
      state.totalResults = 0;
    },

    // Filter actions
    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload;
    },
    setBrands: (state, action) => {
      state.filters.brands = action.payload;
    },
    setCategories: (state, action) => {
      state.filters.categories = action.payload;
    },
    setRatings: (state, action) => {
      state.filters.ratings = action.payload;
    },
    setAvailability: (state, action) => {
      state.filters.availability = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setViewMode: (state, action) => {
      state.filters.viewMode = action.payload;
    },
    // Advanced filter actions
    setDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    setLocation: (state, action) => {
      state.filters.location = action.payload;
    },
    setTags: (state, action) => {
      state.filters.tags = action.payload;
    },
    setFeatures: (state, action) => {
      state.filters.features = action.payload;
    },
    setCondition: (state, action) => {
      state.filters.condition = action.payload;
    },
    setWarranty: (state, action) => {
      state.filters.warranty = action.payload;
    },
    setFreeShipping: (state, action) => {
      state.filters.freeShipping = action.payload;
    },
    setOnSale: (state, action) => {
      state.filters.onSale = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        priceRange: { min: 0, max: 1000 },
        brands: [],
        categories: [],
        ratings: [],
        availability: "all",
        sortBy: "relevance",
        viewMode: "grid",
        dateRange: { start: null, end: null },
        location: "",
        tags: [],
        features: [],
        condition: "all",
        warranty: "all",
        freeShipping: false,
        onSale: false,
      };
    },

    // UI actions
    toggleFilters: (state) => {
      state.isFiltersOpen = !state.isFiltersOpen;
    },
    setFiltersOpen: (state, action) => {
      state.isFiltersOpen = action.payload;
    },
    setSearchFocused: (state, action) => {
      state.isSearchFocused = action.payload;
    },
    setShowSuggestions: (state, action) => {
      state.showSuggestions = action.payload;
    },

    // Search history actions
    addToSearchHistory: (state, action) => {
      const query = action.payload;
      // Remove if already exists
      state.searchHistory = state.searchHistory.filter(
        (item) => item !== query
      );
      // Add to beginning
      state.searchHistory.unshift(query);
      // Keep only max items
      if (state.searchHistory.length > state.maxHistoryItems) {
        state.searchHistory = state.searchHistory.slice(
          0,
          state.maxHistoryItems
        );
      }
      saveSearchHistory(state.searchHistory);
    },
    removeFromSearchHistory: (state, action) => {
      const query = action.payload;
      state.searchHistory = state.searchHistory.filter(
        (item) => item !== query
      );
      saveSearchHistory(state.searchHistory);
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem("searchHistory");
    },

    // Search alerts actions
    addToSearchAlerts: (state, action) => {
      const alert = action.payload;
      // Remove if already exists
      state.searchAlerts = state.searchAlerts.filter(
        (item) => item.id === alert.id
      );
      // Add to beginning
      state.searchAlerts.unshift(alert);
      // Keep only max items
      if (state.searchAlerts.length > state.maxAlertsItems) {
        state.searchAlerts = state.searchAlerts.slice(0, state.maxAlertsItems);
      }
      saveSearchAlerts(state.searchAlerts);
    },
    removeFromSearchAlerts: (state, action) => {
      const alertId = action.payload;
      state.searchAlerts = state.searchAlerts.filter(
        (item) => item.id !== alertId
      );
      saveSearchAlerts(state.searchAlerts);
    },
    clearSearchAlerts: (state) => {
      state.searchAlerts = [];
      localStorage.removeItem("searchAlerts");
    },

    // Analytics actions
    setShowAnalytics: (state, action) => {
      state.showAnalytics = action.payload;
    },
    setShowInsights: (state, action) => {
      state.showInsights = action.payload;
    },

    // Export actions
    setIsExporting: (state, action) => {
      state.isExporting = action.payload;
    },
    setExportError: (state, action) => {
      state.exportError = action.payload;
    },

    // Reset actions
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    clearError: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.products || [];
        state.totalResults = action.payload.total || 0;
        // Add to search history
        if (state.query.trim()) {
          state.searchHistory = state.searchHistory.filter(
            (item) => item !== state.query
          );
          state.searchHistory.unshift(state.query);
          if (state.searchHistory.length > state.maxHistoryItems) {
            state.searchHistory = state.searchHistory.slice(
              0,
              state.maxHistoryItems
            );
          }
          saveSearchHistory(state.searchHistory);
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Search Suggestions
      .addCase(getSearchSuggestions.pending, (state) => {
        // Don't set loading for suggestions
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload.suggestions || [];
      })
      .addCase(getSearchSuggestions.rejected, (state, action) => {
        state.suggestions = [];
      })
      // Get Trending Searches
      .addCase(getTrendingSearches.pending, (state) => {
        // Don't set loading for trending searches
      })
      .addCase(getTrendingSearches.fulfilled, (state, action) => {
        state.trendingSearches = action.payload.trending || [];
      })
      .addCase(getTrendingSearches.rejected, (state, action) => {
        state.trendingSearches = [];
      })
      // Get Search Analytics
      .addCase(getSearchAnalytics.pending, (state) => {
        // Don't set loading for analytics
      })
      .addCase(getSearchAnalytics.fulfilled, (state, action) => {
        state.searchAnalytics = action.payload;
      })
      .addCase(getSearchAnalytics.rejected, (state, action) => {
        // state.searchAnalytics = {}; // No need to reset, it's a total count
      })
      // Get Search Insights
      .addCase(getSearchInsights.pending, (state) => {
        // Don't set loading for insights
      })
      .addCase(getSearchInsights.fulfilled, (state, action) => {
        state.searchInsights = action.payload;
      })
      .addCase(getSearchInsights.rejected, (state, action) => {
        // state.searchInsights = {}; // No need to reset, it's a total count
      })
      // Export Search Results
      .addCase(exportSearchResults.pending, (state) => {
        state.isExporting = true;
        state.exportError = null;
      })
      .addCase(exportSearchResults.fulfilled, (state, action) => {
        state.isExporting = false;
        // You might want to trigger a download here or handle the blob data
        // For now, we'll just log the success
        console.log("Search results exported successfully:", action.payload);
      })
      .addCase(exportSearchResults.rejected, (state, action) => {
        state.isExporting = false;
        state.exportError = action.payload;
        console.error("Error exporting search results:", action.payload);
      });
  },
});

export const {
  setQuery,
  clearQuery,
  clearResults,
  setPriceRange,
  setBrands,
  setCategories,
  setRatings,
  setAvailability,
  setSortBy,
  setViewMode,
  setDateRange,
  setLocation,
  setTags,
  setFeatures,
  setCondition,
  setWarranty,
  setFreeShipping,
  setOnSale,
  clearFilters,
  toggleFilters,
  setFiltersOpen,
  setSearchFocused,
  setShowSuggestions,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
  addToSearchAlerts,
  removeFromSearchAlerts,
  clearSearchAlerts,
  setShowAnalytics,
  setShowInsights,
  setIsExporting,
  setExportError,
  reset,
  clearError,
} = searchSlice.actions;

export default searchSlice.reducer;
