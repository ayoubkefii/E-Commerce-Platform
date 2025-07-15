import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiTruck,
  FiShield,
  FiRotateCcw,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Layout from "../components/layout/Layout";
import { addToCart } from "../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../features/wishlist/wishlistSlice";
import { formatDistanceToNow } from "date-fns";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [answeringId, setAnsweringId] = useState(null);
  const [qLoading, setQLoading] = useState(false);
  // Add state for notification
  const [notifiedQuestions, setNotifiedQuestions] = useState([]);

  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(
    (item) => item.product_id === parseInt(id)
  );

  // Find user's review if logged in
  const userReview =
    user && product?.reviews?.find((r) => r.user?.id === user.id);
  const otherReviews =
    product?.reviews?.filter((r) => !user || r.user?.id !== user.id) || [];

  // Pre-fill form if editing
  useEffect(() => {
    if (userReview && editingReviewId === userReview.id) {
      setReviewText(userReview.comment);
      setReviewRating(userReview.rating);
    } else {
      setReviewText("");
      setReviewRating(5);
    }
  }, [userReview, editingReviewId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    // Load wishlist when user is logged in
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  // Fetch Q&A when product loads
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!product) return;
      setQLoading(true);
      try {
        const res = await fetch(`/api/products/${product.id}/questions`);
        setQuestions(await res.json());
      } catch (err) {
        setQuestions([]);
      } finally {
        setQLoading(false);
      }
    };
    if (product && product.id) fetchQuestions();
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (quantity > product.stock) {
      toast.error("Quantity exceeds available stock");
      return;
    }

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image:
          product.main_image ||
          (product.images && product.images[0]) ||
          "/default-image.png",
        quantity: quantity,
      })
    );
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
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

  // Add or update review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingReviewId ? "PUT" : "POST";
      const url = editingReviewId
        ? `/api/products/${product.id}/reviews/${editingReviewId}`
        : `/api/products/${product.id}/reviews`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: user ? `Bearer ${user.token}` : undefined,
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      toast.success(editingReviewId ? "Review updated!" : "Review added!");
      setEditingReviewId(null);
      setReviewText("");
      setReviewRating(5);
      // Refetch product to update reviews
      const refreshed = await fetch(`/api/products/${product.id}`);
      setProduct(await refreshed.json());
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/products/${product.id}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: { Authorization: user ? `Bearer ${user.token}` : undefined },
        }
      );
      if (!res.ok) throw new Error("Failed to delete review");
      toast.success("Review deleted!");
      // Refetch product to update reviews
      const refreshed = await fetch(`/api/products/${product.id}`);
      setProduct(await refreshed.json());
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    } finally {
      setSubmitting(false);
    }
  };

  // Ask a question
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user ? `Bearer ${user.token}` : undefined,
        },
        body: JSON.stringify({ question: questionText }),
      });
      if (!res.ok) throw new Error("Failed to submit question");
      setQuestionText("");
      // Refresh questions
      const qRes = await fetch(`/api/products/${product.id}/questions`);
      setQuestions(await qRes.json());
      toast.success("Question submitted!");
    } catch (err) {
      toast.error(err.message || "Failed to submit question");
    } finally {
      setQLoading(false);
    }
  };

  // Admin answers a question
  const handleAnswer = async (e, qid) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setQLoading(true);
    try {
      const res = await fetch(
        `/api/products/${product.id}/questions/${qid}/answer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: user ? `Bearer ${user.token}` : undefined,
          },
          body: JSON.stringify({ answer: answerText }),
        }
      );
      if (!res.ok) throw new Error("Failed to submit answer");
      setAnswerText("");
      setAnsweringId(null);
      // Refresh questions
      const qRes = await fetch(`/api/products/${product.id}/questions`);
      setQuestions(await qRes.json());
      toast.success("Answer submitted!");
    } catch (err) {
      toast.error(err.message || "Failed to submit answer");
    } finally {
      setQLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product?.discount > 0) {
      const discountAmount = (product.price * product.discount) / 100;
      return product.price - discountAmount;
    }
    return product?.price || 0;
  };

  // Helper to render stars (full stars only)
  const renderStars = (rating, size = "w-5 h-5") => {
    const stars = [];
    const fullStars = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`${size} ${
            i < fullStars
              ? "text-yellow-400 fill-current"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      );
    }
    return stars;
  };

  if (loading) {
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

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const finalPrice = calculateDiscount();
  const images = product.images
    ? JSON.parse(product.images)
    : [product.main_image];
  const mainImage =
    images[selectedImage] || product.main_image || "/default-image.png";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate("/")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <button
                  onClick={() => navigate("/products")}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Products
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/default-image.png";
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-gray-200 dark:border-gray-700"
                    }`}>
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src = "/default-image.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(product.average_rating || 0)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.num_reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(finalPrice)}
              </span>
              {product.discount > 0 && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  -
                </button>
                <span className="px-4 py-1 text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2">
                <FiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 border rounded-md transition-colors flex items-center justify-center ${
                  isInWishlist
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}>
                <FiHeart
                  className={`w-5 h-5 ${
                    isInWishlist
                      ? "text-red-500 fill-current"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <FiTruck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Secure Payment
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FiRotateCcw className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Specifications
            </h3>
            <div className="space-y-2">
              {product.brand && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Brand
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {product.brand}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Category
                </span>
                <span className="text-gray-900 dark:text-white">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">SKU</span>
                <span className="text-gray-900 dark:text-white">
                  {product.sku || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Reviews
            </h3>
            {/* Review Form for logged-in users */}
            {user && (
              <form
                onSubmit={handleReviewSubmit}
                className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-sm font-medium">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none">
                      <FiStar
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 mb-2"
                  rows={3}
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  minLength={10}
                  maxLength={500}
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={submitting || reviewText.length < 10}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                    {editingReviewId
                      ? "Update Review"
                      : userReview
                      ? "Update Review"
                      : "Add Review"}
                  </button>
                  {userReview && !editingReviewId && (
                    <button
                      type="button"
                      onClick={() => setEditingReviewId(userReview.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                      Edit
                    </button>
                  )}
                  {userReview && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(userReview.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                      Delete
                    </button>
                  )}
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={() => setEditingReviewId(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
            {/* Reviews List */}
            <div className="space-y-6">
              {userReview && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < userReview.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                      You
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(userReview.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-100 text-sm">
                    {userReview.comment}
                  </div>
                </div>
              )}
              {otherReviews.length === 0 && !userReview && (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              )}
              {otherReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      {review.user?.name || "User"}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-100 text-sm">
                    {review.comment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Q&A */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product Q&amp;A
          </h3>
          {/* Ask a question */}
          {user && (
            <form
              onSubmit={handleAskQuestion}
              className="mb-6 flex flex-col md:flex-row gap-2 items-start md:items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md p-2"
                placeholder="Ask a question about this product..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                minLength={3}
                maxLength={500}
                required
              />
              <button
                type="submit"
                disabled={qLoading || questionText.length < 3}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                Ask
              </button>
            </form>
          )}
          {/* Q&A List */}
          <div className="space-y-6">
            {qLoading && (
              <div className="text-gray-500">Loading questions...</div>
            )}
            {!qLoading && questions.length === 0 && (
              <div className="text-gray-500">
                No questions yet. Be the first to ask!
              </div>
            )}
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {q.user?.name || "User"}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(q.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {/* Delete question button */}
                  {(user?.role === "admin" || user?.id === q.user_id) && (
                    <button
                      className="ml-2 text-xs text-red-600 hover:underline"
                      onClick={async () => {
                        if (!window.confirm("Delete this question?")) return;
                        setQLoading(true);
                        await fetch(
                          `/api/products/${product.id}/questions/${q.id}`,
                          {
                            method: "DELETE",
                            headers: {
                              Authorization: user
                                ? `Bearer ${user.token}`
                                : undefined,
                            },
                          }
                        );
                        setQuestions(questions.filter((qq) => qq.id !== q.id));
                        setQLoading(false);
                        toast.success("Question deleted");
                      }}>
                      Delete
                    </button>
                  )}
                </div>
                <div className="text-gray-800 dark:text-gray-100 text-sm mb-2">
                  Q: {q.question}
                </div>
                {/* Answers List */}
                <div className="space-y-2 ml-4">
                  {q.answers && q.answers.length > 0 ? (
                    q.answers.map((ans) => (
                      <div key={ans.id} className="flex items-center">
                        <span className="text-green-700 dark:text-green-400 text-sm">
                          A: {ans.answer}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          by {ans.user?.name || "User"} •{" "}
                          {formatDistanceToNow(new Date(ans.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {/* Delete answer button */}
                        {(user?.role === "admin" ||
                          user?.id === ans.user_id) && (
                          <button
                            className="ml-2 text-xs text-red-600 hover:underline"
                            onClick={async () => {
                              if (!window.confirm("Delete this answer?"))
                                return;
                              setQLoading(true);
                              await fetch(
                                `/api/products/${product.id}/questions/${q.id}/answers/${ans.id}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: user
                                      ? `Bearer ${user.token}`
                                      : undefined,
                                  },
                                }
                              );
                              // Refresh questions
                              const qRes = await fetch(
                                `/api/products/${product.id}/questions`
                              );
                              setQuestions(await qRes.json());
                              setQLoading(false);
                              toast.success("Answer deleted");
                            }}>
                            Delete
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No answer yet.</div>
                  )}
                </div>
                {/* Answer form for any user if not already answered by them */}
                {user &&
                  (!q.answers ||
                    !q.answers.some((a) => a.user_id === user.id)) &&
                  (answeringId === q.id ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setQLoading(true);
                        await fetch(
                          `/api/products/${product.id}/questions/${q.id}/answers`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: user
                                ? `Bearer ${user.token}`
                                : undefined,
                            },
                            body: JSON.stringify({ answer: answerText }),
                          }
                        );
                        setAnswerText("");
                        setAnsweringId(null);
                        // Refresh questions
                        const qRes = await fetch(
                          `/api/products/${product.id}/questions`
                        );
                        setQuestions(await qRes.json());
                        setQLoading(false);
                        toast.success("Answer submitted!");
                        // Notification for question owner
                        if (
                          user.id !== q.user_id &&
                          !notifiedQuestions.includes(q.id)
                        ) {
                          toast.info(
                            "The question owner will be notified of your answer."
                          );
                          setNotifiedQuestions([...notifiedQuestions, q.id]);
                        }
                      }}
                      className="flex flex-col md:flex-row gap-2 items-start md:items-center mt-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md p-2"
                        placeholder="Type your answer..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        minLength={1}
                        maxLength={500}
                        required
                      />
                      <button
                        type="submit"
                        disabled={qLoading || answerText.length < 1}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAnsweringId(null);
                          setAnswerText("");
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAnsweringId(q.id);
                        setAnswerText("");
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-xs mt-2">
                      Answer
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
