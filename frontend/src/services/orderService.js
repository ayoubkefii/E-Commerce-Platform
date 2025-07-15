import api from "./api";

const orderService = {
  // Create new order
  createOrder: async (orderData, token) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  // Get user orders
  getUserOrders: async (filters = {}, token) => {
    const response = await api.get("/orders", { params: filters });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id, token) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create payment intent
  createPaymentIntent: async (orderId, token) => {
    const response = await api.post(`/orders/${orderId}/payment-intent`);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (orderId, paymentIntentId, token) => {
    const response = await api.post(`/orders/${orderId}/confirm-payment`, {
      paymentIntentId,
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason, token) => {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Admin: Get all orders
  getAllOrders: async (filters = {}, token) => {
    const response = await api.get("/orders/admin/all", { params: filters });
    return response.data;
  },

  // Admin: Get order statistics
  getOrderStats: async (token) => {
    const response = await api.get("/orders/admin/stats");
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, statusData, token) => {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },
};

export default orderService;
