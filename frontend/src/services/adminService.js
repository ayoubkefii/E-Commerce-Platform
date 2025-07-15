import api from "./api";

const adminService = {
  // Get admin dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get("/orders/admin/stats");
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get("/users/stats");
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async (filters = {}) => {
    const response = await api.get("/orders/admin/all", { params: filters });
    return response.data;
  },

  // Get all users (admin)
  getAllUsers: async (filters = {}) => {
    const response = await api.get("/users", { params: filters });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // Get product statistics
  getProductStats: async () => {
    const response = await api.get("/products/admin/stats");
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async () => {
    const response = await api.get("/admin/activity");
    return response.data;
  },
};

export default adminService;
