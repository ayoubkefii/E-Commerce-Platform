import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";
import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    items: wishlistItems,
    loading,
    error,
  } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist!");
  };

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      dispatch(clearWishlist());
      toast.success("Wishlist cleared!");
    }
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image || "/default-image.png",
        quantity: 1,
      })
    );
    toast.success("Added to cart!");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = (product) => {
    if (product.discount > 0) {
      const discountAmount = (product.price * product.discount) / 100;
      return product.price - discountAmount;
    }
    return product.price;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please login to view your wishlist
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading your wishlist...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Wishlist
            </h1>
            <p className="text-red-600 dark:text-red-400 mb-8">{error}</p>
            <button
              onClick={() => dispatch(getWishlist())}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 dark:bg-gray-800 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20">
              <FiTrash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding products to your wishlist by clicking the heart icon
              on any product.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const finalPrice = calculateDiscount(item);
              const image = item.main_image || "/default-image.png";

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <Link to={`/products/${item.id}`}>
                      <img
                        src={image}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Discount Badge */}
                    {item.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{item.discount}%
                      </div>
                    )}

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-red-500 hover:bg-red-600 shadow-md transition-colors">
                      <FiHeart className="w-4 h-4 text-white fill-current" />
                    </button>

                    {/* Quick Add to Cart */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                        <FiShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {item.category}
                    </div>

                    {/* Product Name */}
                    <Link to={`/products/${item.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <FiStar
                            key={index}
                            className={`w-4 h-4 ${
                              index < Math.floor(item.average_rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        ({item.num_reviews || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(finalPrice)}
                        </span>
                        {item.discount > 0 && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.stock > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}>
                        {item.stock > 0 ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>

                    {/* Brand */}
                    {item.brand && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Brand: {item.brand}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
