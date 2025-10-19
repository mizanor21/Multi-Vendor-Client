// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { sliderSlice } from "./api/sliderSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [sliderSlice.reducerPath]: sliderSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sliderSlice.middleware),
});
export const wrapper = createWrapper(makeStore);
