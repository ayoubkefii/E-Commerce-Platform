import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/adminService";

const initialState = {
  dashboardStats: null,
  userStats: null,
  recentOrders: [],
  recentUsers: [],
  isLoading: false,
  isError: false,
  message: "",
};

// Get dashboard statistics
export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      return await adminService.getDashboardStats();
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

// Get user statistics
export const getUserStats = createAsyncThunk(
  "admin/getUserStats",
  async (_, thunkAPI) => {
    try {
      return await adminService.getUserStats();
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

// Get recent orders
export const getRecentOrders = createAsyncThunk(
  "admin/getRecentOrders",
  async (_, thunkAPI) => {
    try {
      const response = await adminService.getAllOrders({ limit: 5 });
      return response.orders || [];
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

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, statusData }, thunkAPI) => {
    try {
      return await adminService.updateOrderStatus(orderId, statusData);
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

export const adminSlice = createSlice({
  name: "admin",
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
  },
  extraReducers: (builder) => {
    builder
      // Get Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get User Stats
      .addCase(getUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStats = action.payload;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Recent Orders
      .addCase(getRecentOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecentOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentOrders = action.payload;
      })
      .addCase(getRecentOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the order in recentOrders if it exists
        const orderIndex = state.recentOrders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (orderIndex !== -1) {
          state.recentOrders[orderIndex] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearError } = adminSlice.actions;
export default adminSlice.reducer;
