"use client";
import { useLoginStallMutation } from "@/app/api/stallSlice";
import { Button } from "@heroui/react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Store, ArrowRight } from "lucide-react";

export default function SellerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  const [loginStall, { isLoading }] = useLoginStallMutation();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginStall(formData).unwrap();
      Cookies.set("stallInfo", JSON.stringify(res), { expires: 7 });

      await Swal.fire({
        title: "Welcome Back!",
        text: "Logged in successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        backdrop: true,
      });

      router.push("/seller/stall-request");
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text:
          error?.data?.message ||
          error?.data?.error ||
          "Invalid email or password",
        icon: "error",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -top-20 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl mb-4 transform hover:scale-105 transition-transform duration-300">
              <Store className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Seller Login
            </h1>
            <p className="text-gray-600 text-sm">
              Access your seller dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-8 transition-all duration-300 hover:shadow-3xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative group">
                <label
                  htmlFor="email"
                  className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                    focusedField === "email" || formData.email
                      ? "-top-2.5 text-xs text-blue-600 font-semibold"
                      : "top-3.5 text-sm text-gray-500"
                  }`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200">
                    <Mail className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label
                  htmlFor="password"
                  className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                    focusedField === "password" || formData.password
                      ? "-top-2.5 text-xs text-blue-600 font-semibold"
                      : "top-3.5 text-sm text-gray-500"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200">
                    <Lock className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <Link
                  href="/seller/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? "Logging in..." : "Login to Dashboard"}
                  {!isLoading && (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </span>
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-gray-500 bg-white/80">
                  New seller?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              href="/seller/stall-request"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 group"
            >
              Create Stall Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Protected with industry-standard encryption
            </p>
            <p className="text-xs text-gray-400">
              By logging in, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
}