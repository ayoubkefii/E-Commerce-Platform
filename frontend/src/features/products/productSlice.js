import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

const initialState = {
  products: [],
  featuredProducts: [],
  latestProducts: [],
  topRatedProducts: [],
  product: null,
  categories: [],
  brands: [],
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "",
  },
  isLoading: false,
  isError: false,
  message: "",
};

// Get all products
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (filters, thunkAPI) => {
    try {
      const response = await productService.getProducts(filters);
      return response;
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

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (_, thunkAPI) => {
    try {
      const response = await productService.getFeaturedProducts();
      return response;
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

// Get product by ID
export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id, thunkAPI) => {
    try {
      const response = await productService.getProductById(id);
      return response;
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

// Get categories
export const getCategories = createAsyncThunk(
  "products/getCategories",
  async (_, thunkAPI) => {
    try {
      const response = await productService.getCategories();
      return response;
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

// Get brands
export const getBrands = createAsyncThunk(
  "products/getBrands",
  async (_, thunkAPI) => {
    try {
      const response = await productService.getBrands();
      return response;
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

// Get latest products
export const getLatestProducts = createAsyncThunk(
  "products/getLatestProducts",
  async (_, thunkAPI) => {
    try {
      const response = await productService.getLatestProducts();
      return response;
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

// Get top rated products
export const getTopRatedProducts = createAsyncThunk(
  "products/getTopRatedProducts",
  async (_, thunkAPI) => {
    try {
      const response = await productService.getTopRatedProducts();
      return response;
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

// Add product review
export const addProductReview = createAsyncThunk(
  "products/addProductReview",
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const response = await productService.addProductReview(
        productId,
        reviewData,
        token
      );
      return response;
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

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    clearError: (state) => {
      state.isError = false;
      state.message = "";
    },
    clearProduct: (state) => {
      state.product = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        search: "",
        sort: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        };
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load products";
      })
      // Get Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.featuredProducts = action.payload || [];
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load featured products";
      })
      // Get Product by ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load product";
      })
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.categories = action.payload || [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load categories";
      })
      // Get Brands
      .addCase(getBrands.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.brands = action.payload || [];
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load brands";
      })
      // Get Latest Products
      .addCase(getLatestProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getLatestProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.latestProducts = action.payload || [];
      })
      .addCase(getLatestProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load latest products";
      })
      // Get Top Rated Products
      .addCase(getTopRatedProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTopRatedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.topRatedProducts = action.payload || [];
      })
      .addCase(getTopRatedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load top rated products";
      })
      // Add Product Review
      .addCase(addProductReview.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        if (state.product && state.product.id === action.payload.id) {
          state.product = action.payload;
        }
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to add review";
      });
  },
});

export const { reset, clearError, clearProduct, setFilters, clearFilters } =
  productSlice.actions;
export default productSlice.reducer;
