import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../components/layout/Layout";
import { clearCart } from "../features/cart/cartSlice";
import stripeService from "../services/stripeService";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (sessionId) {
        try {
          const response = await stripeService.getSessionDetails(sessionId);
          setSessionDetails(response.session);
        } catch (error) {
          console.error("Error fetching session details:", error);
        }
      }
      setLoading(false);
    };

    fetchSessionDetails();

    // Clear cart after successful payment
    dispatch(clearCart());
  }, [sessionId, dispatch]);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will
            be processed shortly.
          </p>

          {/* Session Details */}
          {sessionDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Details
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-medium">
                    ${(sessionDetails.amount_total / 100).toFixed(2)}{" "}
                    {sessionDetails.currency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-medium capitalize text-green-600">
                    {sessionDetails.payment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Session ID:</span>
                  <span className="font-mono text-xs">{sessionDetails.id}</span>
                </div>
                {sessionDetails.customer_email && (
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">
                      {sessionDetails.customer_email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              What's Next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Your order will be processed and shipped</li>
              <li>• You can track your order in your account</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContinueShopping}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Continue Shopping
            </button>
            <button
              onClick={handleViewOrders}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
