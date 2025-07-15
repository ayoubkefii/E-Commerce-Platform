import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/layout/Layout";
import { getCart } from "../features/cart/cartSlice";
import { createOrder } from "../features/orders/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import OrderConfirmation from "../components/checkout/OrderConfirmation";
import stripeService from "../services/stripeService";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items, subtotal, shippingCost, discount, total, isLoading } =
    useSelector((state) => state.cart);
  const { order, isLoading: orderLoading } = useSelector(
    (state) => state.orders
  );

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Cart Debug Info:", {
      items: items,
      subtotal: subtotal,
      shippingCost: shippingCost,
      discount: discount,
      total: total,
      totalType: typeof total,
      isNaN: isNaN(total),
    });
  }, [items, subtotal, shippingCost, discount, total]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    dispatch(getCart());
  }, [dispatch, user, navigate, items.length]);

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setStep(2);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleContinueToPayment = async () => {
    setIsProcessingPayment(true);

    try {
      // Ensure total is a valid number
      const validTotal = typeof total === "number" && !isNaN(total) ? total : 0;

      console.log("Payment Debug:", {
        email: shippingData.email,
        total: total,
        validTotal: validTotal,
        items: items,
      });

      // Create order first
      const orderData = {
        shippingAddress: shippingData,
        paymentMethod: paymentMethod === "card" ? "stripe" : paymentMethod,
        notes: shippingData.notes,
      };

      const orderResult = await dispatch(createOrder(orderData)).unwrap();

      // Create Stripe checkout session
      const sessionData = await stripeService.createCheckoutSession({
        email: shippingData.email,
        orderId: orderResult.id,
        amount: validTotal * 100, // Convert to cents
        items: items.map((item) => ({
          name: item.product?.name || item.name || "Product",
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (sessionData.success && sessionData.url) {
        // Redirect to Stripe Checkout
        window.location.href = sessionData.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
      setIsProcessingPayment(false);
    }
  };

  const handleBackToShop = () => {
    navigate("/products");
  };

  if (isLoading || orderLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                    }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-16">
            <span
              className={`text-sm ${
                step >= 1 ? "text-blue-600" : "text-gray-500"
              }`}>
              Shipping
            </span>
            <span
              className={`text-sm ${
                step >= 2 ? "text-blue-600" : "text-gray-500"
              }`}>
              Payment
            </span>
            <span
              className={`text-sm ${
                step >= 3 ? "text-blue-600" : "text-gray-500"
              }`}>
              Complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <CheckoutForm
                initialData={shippingData}
                onSubmit={handleShippingSubmit}
              />
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => handlePaymentMethodSelect("card")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label
                      htmlFor="card"
                      className="text-gray-700 dark:text-gray-300">
                      Credit/Debit Card (Stripe)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => handlePaymentMethodSelect("paypal")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label
                      htmlFor="paypal"
                      className="text-gray-700 dark:text-gray-300">
                      PayPal
                    </label>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
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
                        You'll be redirected to a secure payment page to
                        complete your purchase. Your payment information is
                        encrypted and secure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Card Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
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

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    disabled={isProcessingPayment}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                    Back
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    disabled={isProcessingPayment}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessingPayment ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && order && (
              <OrderConfirmation
                order={order}
                onBackToShop={handleBackToShop}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              discount={discount}
              total={total}
              step={step}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
