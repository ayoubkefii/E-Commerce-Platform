import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const PaymentForm = ({ onSuccess, onBack, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setError("");

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Customer Name",
          },
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
      toast.error(stripeError.message);
    } else {
      if (paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      } else {
        setError("Payment failed. Please try again.");
        toast.error("Payment failed. Please try again.");
      }
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payment Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Secure Payment
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your payment information is encrypted and secure. We never store
                your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Test Card Information */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Test Card Information
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              <strong>Card Number:</strong> 4242 4242 4242 4242
            </p>
            <p>
              <strong>Expiry:</strong> Any future date (e.g., 12/25)
            </p>
            <p>
              <strong>CVC:</strong> Any 3 digits (e.g., 123)
            </p>
            <p>
              <strong>ZIP:</strong> Any 5 digits (e.g., 12345)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Back
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Complete Payment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
