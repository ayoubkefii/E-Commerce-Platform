import React, { useState, useEffect } from "react";
import stripeService from "../services/stripeService";

const StripeTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("test@example.com");
  const [stripeHealth, setStripeHealth] = useState(null);

  useEffect(() => {
    // Check Stripe health on component mount
    checkStripeHealth();
  }, []);

  const checkStripeHealth = async () => {
    try {
      const health = await stripeService.healthCheck();
      setStripeHealth(health);
    } catch (error) {
      console.error("Stripe health check failed:", error);
      setStripeHealth({ success: false, message: "Stripe not configured" });
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create checkout session
      const sessionData = await stripeService.createCheckoutSession({
        email: email,
      });

      if (sessionData.success && sessionData.url) {
        setSuccess("Checkout session created! Redirecting to Stripe...");

        // Redirect to Stripe checkout
        window.location.href = sessionData.url;
      } else {
        setError("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error.response?.data?.message || "Failed to create checkout session"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Stripe Integration Test
      </h2>

      {/* Stripe Health Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Stripe Status:</h3>
        {stripeHealth ? (
          <div
            className={`text-sm ${
              stripeHealth.success ? "text-green-600" : "text-red-600"
            }`}>
            {stripeHealth.success ? "✅ " : "❌ "}
            {stripeHealth.message}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Checking...</div>
        )}
      </div>

      {/* Test Form */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1">
            Customer Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter customer email"
          />
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading || !stripeHealth?.success}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading || !stripeHealth?.success
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {loading ? "Creating Session..." : "Test $15 Checkout"}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Instructions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Enter a test email address</li>
          <li>• Click "Test $15 Checkout" to create a Stripe session</li>
          <li>• You'll be redirected to Stripe's checkout page</li>
          <li>• Use test card: 4242 4242 4242 4242</li>
          <li>• Any future expiry date and CVC</li>
          <li>• Check backend logs for webhook events</li>
        </ul>
      </div>
    </div>
  );
};

export default StripeTest;
