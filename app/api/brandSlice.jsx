import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandSlice = createApi({
  reducerPath: "brand",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-backend-orpin.vercel.app/api`,
  }),
  tagTypes: ["brand"],
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: () => ({
        url: `/brands`,
      }),
      providesTags: [{ type: "brand" }],
    }),

    getASingleBrand: builder.query({
      query: (brandId) => ({
        url: `/brands/${brandId}`,
      }),
      providesTags: [{ type: "brand" }],
    }),
  }),
});

export const { useGetASingleBrandQuery, useGetAllBrandsQuery } = brandSlice;
