import api from "./api";

const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login user
  login: async (userData) => {
    const response = await api.post("/auth/login", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("user");
  },

  // Get user profile
  getProfile: async (token) => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData, token) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (formData, token) => {
    const response = await api.post("/auth/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async (password, token) => {
    const response = await api.delete("/auth/account", { data: { password } });
    localStorage.removeItem("user");
    return response.data;
  },
};

export default authService;
