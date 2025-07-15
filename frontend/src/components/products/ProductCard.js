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
import CompareButton from "./CompareButton";

const ProductCard = ({ product }) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
            isInWishlist
              ? "bg-red-500 hover:bg-red-600"
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}>
          <FiHeart
            className={`w-4 h-4 ${
              isInWishlist
                ? "text-white fill-current"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
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
          {product.category}
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
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

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div
            className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* Brand */}
        {product.brand && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Brand: {product.brand}
          </div>
        )}

        {/* Comparison Button */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <CompareButton product={product} size="sm" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
