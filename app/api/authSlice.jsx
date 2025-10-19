import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5500/api",
    baseUrl: `https://multi-vendor-e-com-backend.vercel.app/api`,
  }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (registerData) => ({
        url: "/user/register",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: [{ type: "auth" }],
    }),

    login: builder.mutation({
      query: (loginData) => ({
        url: "/user/login",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: [{ type: "auth" }],
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/user/forgot-password",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: { email },
      }),
      invalidatesTags: [{ type: "auth" }],
    }),

    verifyCode: builder.mutation({
      query: (formData) => ({
        url: "/user/verify-reset-code",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "auth" }],
    }),

    resetPassword: builder.mutation({
      query: (formData) => ({
        url: "/user/reset-password",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "auth" }],
    }),

    getASingleUser: builder.query({
      query: (email) => ({
        url: `/user/me?email=${email}`,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: [{ type: "auth" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    verifyEmailByCode: builder.mutation({
      query: (formData) => ({
        url: "/user/verify-code",
        method: "POST",
        body: formData,
      }),
    }),

    updateProfile: builder.mutation({
      query: ({ formData, email }) => ({
        url: `/user/update?email=${email}`,
        method: "PUT",
        body: formData,
      }),
    }),

    resendVerifyCode: builder.mutation({
      query: (verifyEmail) => ({
        url: "/user/resend-verification",
        method: "POST",
        body: verifyEmail,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetASingleUserQuery,
  useVerifyEmailByCodeMutation,
  useResendVerifyCodeMutation,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = authSlice;
