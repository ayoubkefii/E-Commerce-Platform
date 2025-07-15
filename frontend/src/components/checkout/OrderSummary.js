import React from "react";

const OrderSummary = ({
  items,
  subtotal,
  shippingCost,
  discount,
  total,
  step,
}) => {
  const formatPrice = (price) => {
    // Safety check for invalid price values
    if (price === null || price === undefined || isNaN(price)) {
      return "$0.00";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Safety checks for all values
  const safeSubtotal = subtotal || 0;
  const safeShippingCost = shippingCost || 0;
  const safeDiscount = discount || 0;
  const safeTotal = total || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img
                src={
                  item.product?.main_image ||
                  item.product?.images?.[0] ||
                  "/placeholder-product.jpg"
                }
                alt={item.product?.name || "Product"}
                className="w-12 h-12 object-cover rounded-md"
                onError={(e) => {
                  e.target.src = "/placeholder-product.jpg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.product?.name || "Product"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      {step < 4 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {step === 1 && "Step 1 of 3: Shipping Information"}
              {step === 2 && "Step 2 of 3: Payment Method"}
              {step === 3 && "Step 3 of 3: Complete"}
            </span>
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white">
            {formatPrice(safeSubtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="text-gray-900 dark:text-white">
            {safeShippingCost > 0 ? formatPrice(safeShippingCost) : "Free"}
          </span>
        </div>

        {safeDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Discount</span>
            <span className="text-green-600 dark:text-green-400">
              -{formatPrice(safeDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-gray-900 dark:text-white">
            {formatPrice(safeTotal)}
          </span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Secure checkout powered by Stripe
          </span>
        </div>
      </div>

      {/* Return Policy */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>• Free returns within 30 days</p>
        <p>• Secure payment processing</p>
        <p>• Order confirmation via email</p>
      </div>
    </div>
  );
};

export default OrderSummary;
