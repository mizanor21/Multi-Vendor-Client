import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApiSlice = createApi({
  reducerPath: "cart",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-e-com-backend.vercel.app/api`,
    credentials: "include",
  }),
  tagTypes: ["cart"],
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: `/cart`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: [{ type: "cart" }],
    }),

    getCartProducts: builder.query({
      query: () => ({
        url: `/cart`,
      }),
      providesTags: [{ type: "cart" }],
    }),

    UpdateCartInfo: builder.mutation({
      query: (cartData) => ({
        url: `/cart`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: cartData,
      }),
      invalidatesTags: [{ type: "cart" }],
    }),

    cartItemDelete: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "cart" }],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: `/cart/clear`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "cart" }],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useCartItemDeleteMutation,
  useUpdateCartInfoMutation,
  useClearCartMutation,
} = cartApiSlice;
