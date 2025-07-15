import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Get personalized recommendations
export const getRecommendations = createAsyncThunk(
  "recommendations/getRecommendations",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/products/recommendations");
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

// Get recommendations based on product
export const getProductRecommendations = createAsyncThunk(
  "recommendations/getProductRecommendations",
  async (productId, thunkAPI) => {
    try {
      const response = await api.get(`/products/${productId}/recommendations`);
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

// Get trending products
export const getTrendingProducts = createAsyncThunk(
  "recommendations/getTrendingProducts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/products/trending");
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

const initialState = {
  personalized: [],
  productBased: [],
  trending: [],
  isLoading: false,
  isError: false,
  message: "",
};

const recommendationsSlice = createSlice({
  name: "recommendations",
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
    clearProductRecommendations: (state) => {
      state.productBased = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.personalized = action.payload.products || [];
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Product Recommendations
      .addCase(getProductRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productBased = action.payload.products || [];
      })
      .addCase(getProductRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Trending Products
      .addCase(getTrendingProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrendingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trending = action.payload.products || [];
      })
      .addCase(getTrendingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearError, clearProductRecommendations } =
  recommendationsSlice.actions;

export default recommendationsSlice.reducer;
