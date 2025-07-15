import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/checkout");
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Information */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              What happened?
            </h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• You cancelled the payment process</li>
              <li>• No money was charged to your account</li>
              <li>• Your cart items are still available</li>
              <li>• You can try the payment again anytime</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTryAgain}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Try Payment Again
            </button>
            <button
              onClick={handleBackToCart}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Back to Cart
            </button>
            <button
              onClick={handleContinueShopping}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCancel;
