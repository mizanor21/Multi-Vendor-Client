"use client";
import { useLoginMutation } from "@/app/api/authSlice";
import { Button, Image } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Mail, Lock, ArrowRight, HelpCircle, KeyRound, LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(loginData);
      if (res?.data) {
        Cookies.set("loginInfo", res?.data?.user?.email, { expires: 1 });
        await Swal.fire({
          title: "Welcome Back!",
          text: "Logged in successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          backdrop: true,
        });
        window.location.href = "/";
      } else {
        Swal.fire({
          title: "Login Failed",
          text: res?.error?.data?.error || "Invalid credentials",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <div className="nuni min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block backdrop-blur-xl bg-white/80 rounded-3xl p-4 shadow-2xl border border-white/50 mb-4 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="https://i.postimg.cc/G4xDxPLW/multi-vendor-e-com.jpg"
              alt="main_logo"
              radius="lg"
              className="w-48 h-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleLoginFormSubmit} className="space-y-5">
              {/* Email/Username Field */}
              <div className="relative group">
                <label
                  htmlFor="identifier"
                  className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                    focusedField === "identifier" || loginData.identifier
                      ? "-top-2.5 text-xs text-blue-600 font-semibold"
                      : "top-3.5 text-sm text-gray-500"
                  }`}
                >
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200">
                    <Mail className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    required
                    autoComplete="username"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                    value={loginData.identifier}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("identifier")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label
                  htmlFor="password"
                  className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                    focusedField === "password" || loginData.password
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
                    name="password"
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                    value={loginData.password}
                    onChange={handleInputChange}
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
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-4 h-4" />
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
                  <LogIn className="w-5 h-5" />
                  {isLoading ? "Logging in..." : "Login"}
                  {!isLoading && (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </span>
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative px-8">
            <div className="absolute inset-0 flex items-center px-8">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-gray-500 bg-white/80">
                Need help?
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 grid grid-cols-2 gap-3">
            <Link
              href="/auth/forgot-password"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/60 hover:bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-300 group"
            >
              <KeyRound className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              Reset
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/60 hover:bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-300 group"
            >
              <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              Help
            </Link>
          </div>

          {/* Sign Up Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Don't have an account?
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 group"
            >
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Secure login with encryption
          </p>
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
      `}</style>
    </div>
  );
}