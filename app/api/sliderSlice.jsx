import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sliderSlice = createApi({
  reducerPath: "slider",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-e-com-backend.vercel.app/api`,
  }),
  tagTypes: ["slider"],
  endpoints: (builder) => ({
    getAllActiveSliders: builder.query({
      query: (token) => ({
        url: "/sliders/active",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: [{ type: "slider", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getASingleSlide: builder.query({
      query: (id) => ({
        url: `/sliders/${id}`,
      }),
      providesTags: [{ type: "slider", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetASingleSlideQuery, useGetAllActiveSlidersQuery } =
  sliderSlice;
