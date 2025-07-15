import api from "./api";

const cartService = {
  // Get user cart
  getCart: async (token) => {
    const response = await api.get("/cart");
    return response.data;
  },

  // Add item to cart
  addToCart: async (cartData, token) => {
    const response = await api.post("/cart/add", cartData);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (cartData, token) => {
    const response = await api.put("/cart/update", cartData);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId, token) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (token) => {
    const response = await api.delete("/cart/clear");
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (couponData, token) => {
    const response = await api.post("/cart/coupon", couponData);
    return response.data;
  },

  // Remove coupon
  removeCoupon: async (token) => {
    const response = await api.delete("/cart/coupon");
    return response.data;
  },

  // Set shipping address
  setShippingAddress: async (addressData, token) => {
    const response = await api.put("/cart/shipping-address", addressData);
    return response.data;
  },

  // Set shipping method
  setShippingMethod: async (methodData, token) => {
    const response = await api.put("/cart/shipping-method", methodData);
    return response.data;
  },

  // Get cart summary
  getCartSummary: async (token) => {
    const response = await api.get("/cart/summary");
    return response.data;
  },
};

export default cartService;
