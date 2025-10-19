import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shippingSlice = createApi({
  reducerPath: "shipping",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-e-com-backend.vercel.app/api`,
    credentials: "include",
  }),
  tagTypes: ["shipping"],
  endpoints: (builder) => ({
    createAnOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: [{ type: "shipping", id: "LIST" }],
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: `/orders`,
      }),
      providesTags: [{ type: "shipping" }],
    }),

    getAllOrdersOfAnStallOwner: builder.query({
      query: (email) => ({
        url: `/orders/stall-owner/${email}`,
      }),
      providesTags: [{ type: "shipping" }],
    }),

    updateAnOrder: builder.mutation({
      query: ({ orderData, orderId }) => ({
        url: `/orders/${orderId}/status`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: orderData,
      }),
      invalidatesTags: [{ type: "shipping", id: "LIST" }],
    }),

    orderDelete: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "shipping" }],
    }),
  }),
});

export const {
  useCreateAnOrderMutation,
  useGetAllOrdersQuery,
  useGetAllOrdersOfAnStallOwnerQuery,
  useOrderDeleteMutation,
  useUpdateAnOrderMutation,
} = shippingSlice;
