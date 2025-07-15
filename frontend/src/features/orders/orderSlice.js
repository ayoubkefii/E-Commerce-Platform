import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

const initialState = {
  orders: [],
  order: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  isError: false,
  message: "",
};

// Create order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await orderService.createOrder(orderData, token);
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

// Get user orders
export const getUserOrders = createAsyncThunk(
  "orders/getUserOrders",
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await orderService.getUserOrders(filters, token);
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

// Get order by ID
export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await orderService.getOrderById(id, token);
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

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  "orders/createPaymentIntent",
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await orderService.createPaymentIntent(orderId, token);
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

// Confirm payment
export const confirmPayment = createAsyncThunk(
  "orders/confirmPayment",
  async ({ orderId, paymentIntentId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await orderService.confirmPayment(orderId, paymentIntentId, token);
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

// Cancel order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ orderId, reason }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await orderService.cancelOrder(orderId, reason, token);
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

export const orderSlice = createSlice({
  name: "orders",
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
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        };
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        // Payment intent data can be stored in state if needed
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Confirm Payment
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.order && state.order._id === action.payload.order._id) {
          state.order = action.payload.order;
        }
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.order && state.order._id === action.payload.order._id) {
          state.order = action.payload.order;
        }
        // Update order in orders list
        const orderIndex = state.orders.findIndex(
          (order) => order._id === action.payload.order._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
