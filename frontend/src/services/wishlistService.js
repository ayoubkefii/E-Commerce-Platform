import api from "./api";

const wishlistService = {
  // Get user wishlist
  getWishlist: async (token) => {
    const response = await api.get("/wishlist");
    return response.data;
  },

  // Add item to wishlist
  addToWishlist: async (productId, token) => {
    const response = await api.post("/wishlist/add", { productId });
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId, token) => {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async (token) => {
    const response = await api.delete("/wishlist/clear");
    return response.data;
  },

  // Check if product is in wishlist
  checkWishlistStatus: async (productId, token) => {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },
};

export default wishlistService;
