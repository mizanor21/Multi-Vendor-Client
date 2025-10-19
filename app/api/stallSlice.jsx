import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stallSlice = createApi({
  reducerPath: "stall",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-e-com-backend.vercel.app/api`,
  }),
  tagTypes: ["stall"],
  endpoints: (builder) => ({
    createAStall: builder.mutation({
      query: (fullData) => ({
        url: "/stalls",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: fullData,
      }),
      invalidatesTags: [{ type: "stall", id: "LIST" }],
    }),

    loginStall: builder.mutation({
      query: (formData) => ({
        url: "/stalls/login",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "stall", id: "LIST" }],
    }),

    uploadAProductBySeller: builder.mutation({
      query: ({ formData, email }) => ({
        url: `/stalls/product/create?email=${email}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "stall", id: "LIST" }],
    }),

    getAllStall: builder.query({
      query: () => ({
        url: `/stalls`,
      }),
      providesTags: [{ type: "stall" }],
    }),

    getASingleStall: builder.query({
      query: (stallId) => ({
        url: `/stalls/single/${stallId}`,
      }),
      providesTags: [{ type: "stall" }],
    }),

    getAStallByEmail: builder.query({
      query: (email) => ({
        url: `/stalls/${email}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result?.map((stall) => ({
                type: "stall",
                id: stall._id,
              })),
              { type: "stall", id: "LIST" },
            ]
          : [{ type: "stall", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    stallUpdate: builder.mutation({
      query: ({ stallData, stallId }) => ({
        url: `/stalls/${stallId}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: stallData,
      }),
      invalidatesTags: [{ type: "stall", id: "PROFILE" }],
    }),

    stallDelete: builder.mutation({
      query: (stallId) => ({
        url: `/stalls/${stallId}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "stall", id: stallId },
        { type: "stall", id: "LIST" },
      ],
    }),
    sellerDeleteAProduct: builder.mutation({
      query: ({ productId, email }) => ({
        url: `/stalls/product/${productId}?email=${email}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "stall", id: productId },
        { type: "stall", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateAStallMutation,
  useGetASingleStallQuery,
  useGetAStallByEmailQuery,
  useStallDeleteMutation,
  useStallUpdateMutation,
  useUploadAProductBySellerMutation,
  useSellerDeleteAProductMutation,
  useLoginStallMutation,
  useGetAllStallQuery,
} = stallSlice;
