import React from "react";
import { useDispatch } from "react-redux";
import { updateCartItem, removeFromCart } from "../../features/cart/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      dispatch(
        updateCartItem({
          productId: item.product_id || item.product?.id,
          quantity: newQuantity,
        })
      );
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.product_id || item.product?.id));
  };

  // Get the correct image source
  const getImageSrc = () => {
    if (item.product?.main_image) {
      return item.product.main_image;
    }
    if (item.product?.images && item.product.images[0]) {
      return item.product.images[0];
    }
    if (item.image) {
      return item.image;
    }
    return "/default-image.png";
  };

  // Get the correct product name
  const getProductName = () => {
    return item.product?.name || item.name || "Product";
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <img
        src={getImageSrc()}
        alt={getProductName()}
        className="w-20 h-20 object-cover rounded-md"
        onError={(e) => {
          e.target.src = "/default-image.png";
        }}
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getProductName()}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {formatPrice(item.price)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          -
        </button>
        <span className="w-12 text-center text-gray-900 dark:text-white">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          +
        </button>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatPrice(item.price * item.quantity)}
        </p>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
