import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { addToCart } from "../../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";

const ProductList = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    dispatch(
      addToCart({
        productId: product.id || product._id,
        name: product.name,
        price: product.price,
        image:
          product.main_image ||
          (product.images && product.images[0]) ||
          "/default-image.png",
        quantity: 1,
      })
    );
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist!");
    } else {
      dispatch(addToWishlist(product.id));
      toast.success("Added to wishlist!");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.discount > 0) {
      const discountAmount = (product.price * product.discount) / 100;
      return product.price - discountAmount;
    }
    return product.price;
  };

  const finalPrice = calculateDiscount();

  // Use main_image if available, else fallback to images[0], else a default
  const image =
    product.main_image ||
    (product.images && product.images[0]) ||
    "/default-image.png";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-center space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link to={`/products/${product.id}`}>
            <img
              src={image}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/default-image.png";
              }}
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Category */}
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <FiStar
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.average_rating || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              ({product.num_reviews || 0})
            </span>
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Brand: {product.brand}
            </div>
          )}

          {/* Stock Status */}
          <div
            className={`inline-block text-xs px-2 py-1 rounded-full mb-3 ${
              product.stock > 0
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex-shrink-0 text-right">
          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(finalPrice)}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                Save {product.discount}%
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2">
              <FiShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-md transition-colors ${
                isInWishlist
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400"
              }`}>
              <FiHeart
                className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
