import api from "./api";

const productService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    const response = await api.get("/products", { params: filters });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, filters = {}) => {
    const response = await api.get(`/products/category/${category}`, {
      params: filters,
    });
    return response.data.products || response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get("/products/featured");
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get("/products/categories");
    return response.data;
  },

  // Get brands
  getBrands: async () => {
    const response = await api.get("/products/brands");
    return response.data;
  },

  // Add product review
  addProductReview: async (productId, reviewData, token) => {
    const response = await api.post(
      `/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  },

  // Update product review
  updateProductReview: async (productId, reviewId, reviewData, token) => {
    const response = await api.put(
      `/products/${productId}/reviews/${reviewId}`,
      reviewData
    );
    return response.data;
  },

  // Delete product review
  deleteProductReview: async (productId, reviewId, token) => {
    const response = await api.delete(
      `/products/${productId}/reviews/${reviewId}`
    );
    return response.data;
  },

  // Admin: Create product
  createProduct: async (productData, token) => {
    const response = await api.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Admin: Update product
  updateProduct: async (id, productData, token) => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Admin: Delete product
  deleteProduct: async (id, token) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get latest products
  getLatestProducts: async () => {
    const response = await api.get("/products/latest");
    return response.data;
  },

  // Get top rated products
  getTopRatedProducts: async () => {
    const response = await api.get("/products/top-rated");
    return response.data;
  },
};

export default productService;
