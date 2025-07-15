import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

const initialState = {
  items: [],
  cartItems: [], // Add this line for compatibility
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  shippingCost: 0,
  total: 0,
  coupon: null,
  shippingAddress: null,
  shippingMethod: null,
  isLoading: false,
  isError: false,
  message: "",
};

// Get cart
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await cartService.getCart(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.addToCart(cartData, token);
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

// Update cart item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (cartData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.updateCartItem(cartData, token);
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

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.removeFromCart(productId, token);
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

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.clearCart(token);
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

// Apply coupon
export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async (couponData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.applyCoupon(couponData, token);
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

// Remove coupon
export const removeCoupon = createAsyncThunk(
  "cart/removeCoupon",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.removeCoupon(token);
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

// Set shipping address
export const setShippingAddress = createAsyncThunk(
  "cart/setShippingAddress",
  async (addressData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.setShippingAddress(addressData, token);
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

// Set shipping method
export const setShippingMethod = createAsyncThunk(
  "cart/setShippingMethod",
  async (methodData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await cartService.setShippingMethod(methodData, token);
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

export const cartSlice = createSlice({
  name: "cart",
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
    updateCartTotals: (state) => {
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.subtotal = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      state.discount = state.coupon
        ? state.coupon.type === "percentage"
          ? (state.subtotal * state.coupon.discount) / 100
          : Math.min(state.coupon.discount, state.subtotal)
        : 0;
      state.shippingCost = state.shippingMethod ? state.shippingMethod.cost : 0;
      state.total = state.subtotal - state.discount + state.shippingCost;
    },
    // Add local state update actions
    updateCartItemLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.productId === productId || item.product_id === productId
      );
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity;
        state.cartItems = state.items;
        // Recalculate totals
        state.totalItems = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.subtotal = state.items.reduce(
          (total, item) => total + (item.price || 0) * item.quantity,
          0
        );
        state.total = state.subtotal + state.shippingCost;
      }
    },
    removeFromCartLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.productId !== productId && item.product_id !== productId
      );
      state.cartItems = state.items;
      // Recalculate totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.subtotal = state.items.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
      state.total = state.subtotal + state.shippingCost;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.cartItems = state.items; // Keep in sync
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shippingCost = action.payload.shippingCost || 0;
        state.total = action.payload.total || 0;
        state.coupon = action.payload.coupon || null;
        state.shippingAddress = action.payload.shippingAddress || null;
        state.shippingMethod = action.payload.shippingMethod || null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.cartItems = state.items; // Keep in sync
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shippingCost = action.payload.shippingCost || 0;
        state.total = action.payload.total || 0;
        state.coupon = action.payload.coupon || null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.cartItems = state.items; // Keep in sync
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shippingCost = action.payload.shippingCost || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.cartItems = state.items; // Keep in sync
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shippingCost = action.payload.shippingCost || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.cartItems = [];
        state.totalItems = 0;
        state.subtotal = 0;
        state.discount = 0;
        state.shippingCost = 0;
        state.total = 0;
        state.coupon = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Apply Coupon
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupon = action.payload.coupon || null;
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove Coupon
      .addCase(removeCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupon = null;
        state.discount = 0;
        state.total = action.payload.total || 0;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Set Shipping Address
      .addCase(setShippingAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setShippingAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shippingAddress = action.payload.shippingAddress || null;
      })
      .addCase(setShippingAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Set Shipping Method
      .addCase(setShippingMethod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setShippingMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shippingMethod = action.payload.shippingMethod || null;
        state.shippingCost = action.payload.shippingCost || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(setShippingMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  clearError,
  updateCartTotals,
  updateCartItemLocal,
  removeFromCartLocal,
} = cartSlice.actions;
export default cartSlice.reducer;
