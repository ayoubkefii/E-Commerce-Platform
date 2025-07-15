import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiArrowRight,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiHeart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiGift,
  FiStar,
  FiPackage,
  FiCreditCard,
  FiLock,
  FiCheckCircle,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import Layout from "../components/layout/Layout";
import {
  clearCart,
  getCart,
  updateCartItemLocal,
  removeFromCartLocal,
  updateCartItem,
  removeFromCart,
} from "../features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    cartItems,
    subtotal,
    shippingCost,
    total,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [isClearing, setIsClearing] = useState(false);
  const [localCartItems, setLocalCartItems] = useState([]);

  // Calculate tax (assuming 8.5% tax rate)
  const tax = subtotal * 0.085;

  useEffect(() => {
    // Load cart data when component mounts
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Update local cart items when Redux state changes
    setLocalCartItems(cartItems || []);
  }, [cartItems]);

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/checkout");
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      // Update local state immediately for better UX
      setLocalCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId || item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Dispatch to Redux for local state
      dispatch(updateCartItemLocal({ productId, quantity: newQuantity }));

      // Also sync with backend
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    // Update local state immediately
    setLocalCartItems((prev) =>
      prev.filter(
        (item) => item.productId !== productId && item.product_id !== productId
      )
    );

    // Dispatch to Redux for local state
    dispatch(removeFromCartLocal(productId));

    // Also sync with backend
    dispatch(removeFromCart(productId));
  };

  // Get the correct image source
  const getImageSrc = (item) => {
    if (item.product?.main_image) {
      return item.product.main_image;
    }
    if (item.product?.images && item.product.images[0]) {
      return item.product.images[0];
    }
    if (item.image) {
      return item.image;
    }
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEM0Q0RDYiLz4KPC9zdmc+";
  };

  // Get the correct product name
  const getProductName = (item) => {
    return item.product?.name || item.name || "Product";
  };

  // Get the correct product ID
  const getProductId = (item) => {
    return item.productId || item.product_id || item.product?.id;
  };

  // Get the correct price
  const getPrice = (item) => {
    return item.price || item.product?.price || 0;
  };

  // Recommended products data
  const recommendedProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      rating: 4.6,
      reviews: 89,
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
      rating: 4.7,
      reviews: 56,
    },
    {
      id: 4,
      name: "Wireless Mouse",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
      rating: 4.5,
      reviews: 203,
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <FiRefreshCw className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Loading your cart...
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message || "Failed to load your cart. Please try again."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(getCart())}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Show empty cart
  if (!localCartItems || localCartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-8 shadow-2xl">
                <FiShoppingBag className="w-16 h-16 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your cart is empty
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to discover amazing products!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Start Shopping
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                  Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Shopping Cart
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {localCartItems.length} item
                  {localCartItems.length !== 1 ? "s" : ""} in your cart
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearCart}
                disabled={isClearing}
                className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300">
                <FiTrash2 className="w-4 h-4" />
                <span>{isClearing ? "Clearing..." : "Clear Cart"}</span>
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <FiPackage className="w-5 h-5 text-blue-500" />
                    <span>Cart Items</span>
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {localCartItems.map((item, index) => (
                      <motion.div
                        key={getProductId(item)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={getImageSrc(item)}
                              alt={getProductName(item)}
                              className="w-20 h-20 object-cover rounded-lg shadow-md"
                              onError={(e) => {
                                e.target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEM0Q0RDYiLz4KPC9zdmc+";
                              }}
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleRemoveItem(getProductId(item))
                              }
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                              <FiX className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {getProductName(item)}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {formatPrice(getPrice(item))}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleQuantityChange(
                                  getProductId(item),
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                              <FiMinus className="w-3 h-3" />
                            </motion.button>
                            <span className="w-12 text-center text-gray-900 dark:text-white font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleQuantityChange(
                                  getProductId(item),
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                              <FiPlus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatPrice(getPrice(item) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-1">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <FiCreditCard className="w-5 h-5 text-purple-500" />
                  <span>Order Summary</span>
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {shippingCost > 0 ? formatPrice(shippingCost) : "Free"}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatPrice(tax)}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                  <FiLock className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Continue Shopping */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="mt-4 text-center">
                  <Link
                    to="/products"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium hover:underline transition-all duration-300">
                    Continue Shopping
                  </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <FiShield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Secure Payment
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <FiTruck className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Free Shipping
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        On orders over $50
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <FiGift className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        30-Day Returns
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-300">
                        Easy returns & exchanges
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Recommended Products */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-2">
              <FiHeart className="w-8 h-8 text-red-500" />
              <span>You might also like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                        <FiPlus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {product.reviews} reviews
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
