import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import comparisonReducer from "../features/comparison/comparisonSlice";
import recentlyViewedReducer from "../features/recentlyViewed/recentlyViewedSlice";
import recommendationsReducer from "../features/recommendations/recommendationsSlice";
import searchReducer from "../features/search/searchSlice";
import uiReducer from "../features/ui/uiSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
    comparison: comparisonReducer,
    recentlyViewed: recentlyViewedReducer,
    recommendations: recommendationsReducer,
    search: searchReducer,
    ui: uiReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
