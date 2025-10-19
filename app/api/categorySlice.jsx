import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categorySlice = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-e-com-backend.vercel.app/api`,
  }),
  tagTypes: ["category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/categories",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "category",
                id: category._id,
              })),
              { type: "category", id: "LIST" },
            ]
          : [{ type: "category", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
    getASingleCategory: builder.query({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "category",
                id: category._id,
              })),
              { type: "category", id: "LIST" },
            ]
          : [{ type: "category", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetAllCategoriesQuery, useGetASingleCategoryQuery } =
  categorySlice;
