import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const OrderConfirmation = ({ order, onBackToShop }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Order Number
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              #{order.id || order._id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Order Date
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(order.created_at || order.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Payment Status
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Paid
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Amount
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      {order.shippingAddress && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Shipping Information
          </h3>

          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {order.shippingAddress.address}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {order.shippingAddress.country}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Items
        </h3>

        <div className="space-y-4">
          {(order.orderItems || order.items || []).map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={
                    item.product?.main_image ||
                    item.product?.images?.[0] ||
                    item.image ||
                    "/placeholder-product.jpg"
                  }
                  alt={item.product?.name || item.name || "Product"}
                  className="w-12 h-12 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.product?.name || item.name || "Product"}
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
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          What's Next?
        </h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Order Confirmation Email
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You'll receive a confirmation email with your order details
                shortly.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Order Processing
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                We'll process your order and prepare it for shipping within 1-2
                business days.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Shipping Notification
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You'll receive a shipping confirmation with tracking information
                once your order ships.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onBackToShop}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Continue Shopping
        </button>

        <button
          onClick={() => window.print()}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          Print Receipt
        </button>
      </div>

      {/* Contact Information */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Questions about your order? Contact us at support@ecommerce.com</p>
        <p>or call us at 1-800-ECOMMERCE</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
