import { createSlice } from "@reduxjs/toolkit";

// Load recently viewed products from localStorage
const loadRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem("recentlyViewed");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading recently viewed products:", error);
    return [];
  }
};

// Save recently viewed products to localStorage
const saveRecentlyViewed = (products) => {
  try {
    localStorage.setItem("recentlyViewed", JSON.stringify(products));
  } catch (error) {
    console.error("Error saving recently viewed products:", error);
  }
};

const initialState = {
  recentlyViewed: loadRecentlyViewed(),
  maxItems: 20,
};

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState,
  reducers: {
    addToRecentlyViewed: (state, action) => {
      const product = action.payload;

      // Remove if already exists (to move to front)
      state.recentlyViewed = state.recentlyViewed.filter(
        (item) => item.id !== product.id
      );

      // Add to beginning
      state.recentlyViewed.unshift(product);

      // Keep only max items
      if (state.recentlyViewed.length > state.maxItems) {
        state.recentlyViewed = state.recentlyViewed.slice(0, state.maxItems);
      }

      // Save to localStorage
      saveRecentlyViewed(state.recentlyViewed);
    },
    removeFromRecentlyViewed: (state, action) => {
      const productId = action.payload;
      state.recentlyViewed = state.recentlyViewed.filter(
        (item) => item.id !== productId
      );
      saveRecentlyViewed(state.recentlyViewed);
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
      localStorage.removeItem("recentlyViewed");
    },
    setMaxItems: (state, action) => {
      state.maxItems = action.payload;
      // Trim existing items if needed
      if (state.recentlyViewed.length > state.maxItems) {
        state.recentlyViewed = state.recentlyViewed.slice(0, state.maxItems);
        saveRecentlyViewed(state.recentlyViewed);
      }
    },
  },
});

export const {
  addToRecentlyViewed,
  removeFromRecentlyViewed,
  clearRecentlyViewed,
  setMaxItems,
} = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
