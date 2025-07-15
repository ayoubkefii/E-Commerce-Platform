import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiMaximize2, FiCheck } from "react-icons/fi";
import {
  addToComparison,
  removeFromComparison,
  openComparison,
} from "../../features/comparison/comparisonSlice";

const CompareButton = ({ product, size = "md", showText = true }) => {
  const dispatch = useDispatch();
  const { comparisonItems, maxItems } = useSelector(
    (state) => state.comparison
  );

  const isInComparison = comparisonItems.some((item) => item.id === product.id);

  const handleToggleComparison = () => {
    if (isInComparison) {
      dispatch(removeFromComparison(product.id));
    } else {
      if (comparisonItems.length >= maxItems) {
        // Show notification that max items reached
        alert(`You can compare up to ${maxItems} products at a time.`);
        return;
      }
      dispatch(addToComparison(product));
    }
  };

  const handleOpenComparison = () => {
    dispatch(openComparison());
  };

  const getButtonClasses = () => {
    const baseClasses =
      "flex items-center justify-center rounded-lg transition-all duration-300 font-medium";

    if (size === "sm") {
      return `${baseClasses} px-2 py-1 text-xs`;
    } else if (size === "lg") {
      return `${baseClasses} px-4 py-2 text-sm`;
    } else {
      return `${baseClasses} px-3 py-1.5 text-sm`;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-5 h-5";
      default:
        return "w-4 h-4";
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleComparison}
        className={`${getButtonClasses()} ${
          isInComparison
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}>
        {isInComparison ? (
          <FiCheck className={getIconSize()} />
        ) : (
          <FiMaximize2 className={getIconSize()} />
        )}
        {showText && (
          <span className="ml-1">{isInComparison ? "Added" : "Compare"}</span>
        )}
      </motion.button>

      {comparisonItems.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenComparison}
          className={`${getButtonClasses()} bg-blue-500 text-white hover:bg-blue-600`}>
          <span className="bg-white text-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold mr-1">
            {comparisonItems.length}
          </span>
          {showText && <span>View</span>}
        </motion.button>
      )}
    </div>
  );
};

export default CompareButton;
