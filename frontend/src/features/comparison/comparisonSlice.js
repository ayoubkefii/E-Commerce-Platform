import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comparisonItems: [],
  maxItems: 4,
  isComparisonOpen: false,
};

const comparisonSlice = createSlice({
  name: "comparison",
  initialState,
  reducers: {
    addToComparison: (state, action) => {
      const product = action.payload;
      const exists = state.comparisonItems.find(
        (item) => item.id === product.id
      );
      
      if (!exists && state.comparisonItems.length < state.maxItems) {
        state.comparisonItems.push(product);
      }
    },
    removeFromComparison: (state, action) => {
      const productId = action.payload;
      state.comparisonItems = state.comparisonItems.filter(
        (item) => item.id !== productId
      );
    },
    clearComparison: (state) => {
      state.comparisonItems = [];
    },
    toggleComparison: (state) => {
      state.isComparisonOpen = !state.isComparisonOpen;
    },
    openComparison: (state) => {
      state.isComparisonOpen = true;
    },
    closeComparison: (state) => {
      state.isComparisonOpen = false;
    },
  },
});

export const {
  addToComparison,
  removeFromComparison,
  clearComparison,
  toggleComparison,
  openComparison,
  closeComparison,
} = comparisonSlice.actions;

export default comparisonSlice.reducer; 