import { configureStore } from "@reduxjs/toolkit";
import { sliderSlice } from "./api/sliderSlice.jsx";
import { productSlice } from "./api/productSlice.jsx";
import { categorySlice } from "./api/categorySlice.jsx";
import { stallSlice } from "./api/stallSlice.jsx";
import { authSlice } from "./api/authSlice.jsx";
import { reviewSlice } from "./api/reviewSlice.jsx";
import { shippingSlice } from "./api/shippingSlice.jsx";
import { brandSlice } from "./api/brandSlice.jsx";
import { cartApiSlice } from "./api/cartApiSlice.jsx";
import { orderSlice } from "./api/orderSlice.jsx";

export const store = configureStore({
  reducer: {
    [sliderSlice.reducerPath]: sliderSlice.reducer,
    [productSlice.reducerPath]: productSlice.reducer,
    [categorySlice.reducerPath]: categorySlice.reducer,
    [stallSlice.reducerPath]: stallSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [reviewSlice.reducerPath]: reviewSlice.reducer,
    [shippingSlice.reducerPath]: shippingSlice.reducer,
    [brandSlice.reducerPath]: brandSlice.reducer,
    [cartApiSlice.reducerPath]: cartApiSlice.reducer,
    [orderSlice.reducerPath]: orderSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      sliderSlice.middleware,
      productSlice.middleware,
      categorySlice.middleware,
      stallSlice.middleware,
      authSlice.middleware,
      reviewSlice.middleware,
      shippingSlice.middleware,
      brandSlice.middleware,
      cartApiSlice.middleware,
      orderSlice.middleware
    ),
});
