import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderSlice = createApi({
  reducerPath: "order",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-backend-orpin.vercel.app/api`,
  }),
  tagTypes: ["order"],
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: `/orders`,
      }),
      providesTags: [{ type: "order" }],
    }),

    getAllOrdersOfAnUser: builder.query({
      query: (email) => ({
        url: `/orders/user/${email}`,
      }),
      providesTags: [{ type: "order" }],
    }),
  }),
});

export const { useGetAllOrdersOfAnUserQuery } = orderSlice;
