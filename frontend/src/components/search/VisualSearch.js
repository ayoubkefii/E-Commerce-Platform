import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCamera,
  FiUpload,
  FiX,
  FiImage,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiCheck,
  FiEye,
  FiShoppingCart,
  FiHeart,
  FiMaximize2,
} from "react-icons/fi";

const VisualSearch = ({ onVisualResult, onClose, isOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState("");
  const [dragCounter, setDragCounter] = useState(0);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragCounter((prev) => prev - 1);
    if (dragCounter === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setDragCounter(0);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCameraCapture = () => {
    // This would integrate with device camera
    // For now, we'll simulate it
    alert("Camera capture feature coming soon!");
  };

  const handleSearch = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Simulate API call for visual search
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock similar products data
      const mockProducts = [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones",
          price: 89.99,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
          similarity: 0.95,
          rating: 4.8,
          reviews: 124,
        },
        {
          id: 2,
          name: "Premium Noise Cancelling Headphones",
          price: 199.99,
          image:
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
          similarity: 0.87,
          rating: 4.6,
          reviews: 89,
        },
        {
          id: 3,
          name: "Gaming Headset with Microphone",
          price: 79.99,
          image:
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop",
          similarity: 0.82,
          rating: 4.4,
          reviews: 203,
        },
        {
          id: 4,
          name: "Sport Wireless Earbuds",
          price: 59.99,
          image:
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
          similarity: 0.78,
          rating: 4.3,
          reviews: 156,
        },
      ];

      setSimilarProducts(mockProducts);
      onVisualResult(mockProducts);
    } catch (err) {
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setSimilarProducts([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatSimilarity = (similarity) => {
    return Math.round(similarity * 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FiCamera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Visual Search
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload an image to find similar products
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Image Upload Section */}
            <div className="mb-8">
              {!selectedImage ? (
                <div
                  ref={dropZoneRef}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}>
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload an Image
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop an image here, or click to browse
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                      Browse Files
                    </button>
                    <button
                      onClick={handleCameraCapture}
                      className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                      Take Photo
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Selected"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={handleClear}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiImage className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedImage.name}
                      </span>
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={isProcessing}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50">
                      {isProcessing ? (
                        <>
                          <FiRefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FiSearch className="w-4 h-4" />
                          <span>Find Similar Products</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiAlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Similar Products Results */}
            {similarProducts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Similar Products Found
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden group">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {formatSimilarity(product.similarity)}% Match
                        </div>
                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <FiSearch className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {product.reviews} reviews
                          </span>
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <FiShoppingCart className="w-4 h-4" />
                            <span className="text-sm">Add to Cart</span>
                          </button>
                          <button className="p-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                            <FiHeart className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                            <FiMaximize2 className="w-4 h-4" />
                            <span>Compare</span>
                          </button>
                          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                            <FiEye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Visual Search Tips:
              </h4>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Upload clear, high-quality images for better results</li>
                <li>• Focus on the main product in the image</li>
                <li>• Avoid cluttered backgrounds for more accurate matches</li>
                <li>• Try different angles if you don't get good results</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisualSearch;
