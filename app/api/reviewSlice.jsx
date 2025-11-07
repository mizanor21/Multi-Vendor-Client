import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewSlice = createApi({
  reducerPath: "review",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-backend-orpin.vercel.app/api`,
  }),
  tagTypes: ["review"],
  endpoints: (builder) => ({
    makeAReview: builder.mutation({
      query: ({ reviewPayload, productId }) => ({
        url: `/review/products/${productId}/reviews`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: reviewPayload,
      }),
      invalidatesTags: [{ type: "review" }],
    }),

    replyReview: builder.mutation({
      query: ({ reply, productId, reviewId }) => ({
        url: `/review/products/${productId}/reviews/${reviewId}/reply`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: reply,
      }),
      invalidatesTags: [{ type: "review" }],
    }),

    UpdateReplyReview: builder.mutation({
      query: ({ reply, productId, reviewId }) => ({
        url: `/review/products/${productId}/reviews/${reviewId}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: reply,
      }),
      invalidatesTags: [{ type: "review" }],
    }),

    reviewDelete: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `/review/products/${productId}/reviews/${reviewId}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "review" }],
    }),
  }),
});

export const {
  useMakeAReviewMutation,
  useReplyReviewMutation,
  useReviewDeleteMutation,
  useUpdateReplyReviewMutation,
} = reviewSlice;
