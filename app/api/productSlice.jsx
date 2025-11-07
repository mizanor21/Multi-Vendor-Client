import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productSlice = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-backend-orpin.vercel.app/api`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "/products",
      }),
      providesTags: [{ type: "product", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getASingleProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: [{ type: "product", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: `/products/search?${searchTerm ? `query=${searchTerm}` : ""}`,
      }),

      providesTags: [{ type: "product", id: "LIST" }],
    }),

    getASellerAllProduct: builder.query({
      query: (email) => ({
        url: `/products/by-seller?email=${email}`,
      }),
      providesTags: [{ type: "product", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getAllCategoriesProduct: builder.query({
      query: ({ categoryId, subcategoryId, microCategoryId }) => {
        // Initialize query parameters with required email
        const params = new URLSearchParams();

        // Conditionally add category IDs if they exist
        if (categoryId) params.append("categoryId", categoryId);
        if (subcategoryId) params.append("subCategoryId", subcategoryId);
        if (microCategoryId) params.append("microCategoryId", microCategoryId);

        return {
          url: `/products/filter-by-category?${params.toString()}`,
        };
      },
      providesTags: [{ type: "product", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getSimilarProducts: builder.query({
      query: (id) => ({
        url: `/products/${id}/similar`,
      }),
      providesTags: [{ type: "product", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getMatchedProducts: builder.query({
      query: (productName) => ({
        url: `/products/match?productName=${productName}`,
      }),
      providesTags: [{ type: "product", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    productInfoUpdate: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/products/${id}`,
        headers: {
          "content-type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [{ type: "product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetASingleProductQuery,
  useGetSimilarProductsQuery,
  useGetASellerAllProductQuery,
  useGetMatchedProductsQuery,
  useGetAllCategoriesProductQuery,
  useSearchProductsQuery,
  useProductInfoUpdateMutation,
} = productSlice;
