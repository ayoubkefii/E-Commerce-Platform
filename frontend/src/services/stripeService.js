import api from "./api";

const STRIPE_API_BASE = "/stripe";

export const stripeService = {
  /**
   * Create a Stripe checkout session
   * @param {Object} data - Checkout session data
   * @param {string} data.email - Customer email
   * @returns {Promise<Object>} - Session data with URL
   */
  createCheckoutSession: async (data = {}) => {
    try {
      const response = await api.post(
        `${STRIPE_API_BASE}/create-checkout-session`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  },

  /**
   * Get checkout session details
   * @param {string} sessionId - Stripe session ID
   * @returns {Promise<Object>} - Session details
   */
  getSessionDetails: async (sessionId) => {
    try {
      const response = await api.get(`${STRIPE_API_BASE}/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting session details:", error);
      throw error;
    }
  },

  /**
   * Check Stripe health/configuration
   * @returns {Promise<Object>} - Health check result
   */
  healthCheck: async () => {
    try {
      const response = await api.get(`${STRIPE_API_BASE}/health`);
      return response.data;
    } catch (error) {
      console.error("Error checking Stripe health:", error);
      throw error;
    }
  },

  /**
   * Redirect to Stripe checkout
   * @param {string} sessionId - Stripe session ID
   */
  redirectToCheckout: (sessionId) => {
    if (typeof window !== "undefined" && window.Stripe) {
      return window.Stripe.redirectToCheckout({
        sessionId: sessionId,
      });
    } else {
      console.error("Stripe.js is not loaded");
      throw new Error("Stripe.js is not loaded");
    }
  },

  /**
   * Load Stripe.js script
   * @param {string} publishableKey - Stripe publishable key
   * @returns {Promise} - Promise that resolves when Stripe is loaded
   */
  loadStripe: (publishableKey) => {
    return new Promise((resolve, reject) => {
      if (window.Stripe) {
        resolve(window.Stripe(publishableKey));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = () => {
        if (window.Stripe) {
          resolve(window.Stripe(publishableKey));
        } else {
          reject(new Error("Failed to load Stripe"));
        }
      };
      script.onerror = () => reject(new Error("Failed to load Stripe"));
      document.head.appendChild(script);
    });
  },
};

export default stripeService;
