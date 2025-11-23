"use client";
import { Button, Image } from "@heroui/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRegisterMutation } from "@/app/api/authSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function Registration() {
  const router = useRouter();

  const [registerData, setRegisterData] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "user",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [register, { isLoading }] = useRegisterMutation();

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrationForm = async (e) => {
    e.preventDefault();
    try {
      const res = await register(registerData);
      if (res?.data) {
        Cookies.set("registeredEmail", registerData?.email, { expires: 24 });
        await Swal.fire({
          title: "Registration Successful!",
          text: "Please check your email for verification code",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/verify-email");
      } else {
        Swal.fire({
          title: "Registration Failed",
          text: res?.error?.data?.error || "Please try again",
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

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-orange-500" },
      { strength: 3, label: "Good", color: "bg-yellow-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
    ];
    return levels[strength];
  };

  const currentStrength = passwordStrength(registerData.password);

  return (
    <div className="nuni min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute -bottom-40 left-1/2 w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image with Parallax */}
          <div
            className="hidden lg:block"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 shadow-2xl border border-white/50 transform hover:scale-105 transition-transform duration-500">
              <Image
                src="https://i.postimg.cc/nrRP1BM9/DALL-E-2025-03-17-21-43-18-A-professional-and-modern-banner-for-a-multi-vendor-e-commerce-site-reg.webp"
                className="rounded-2xl"
                radius="lg"
                alt="Registration Banner"
              />
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Secure Platform</h3>
                    <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-2">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Trusted by Thousands</h3>
                    <p className="text-sm text-gray-600">Join our growing community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full">
            <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-6 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h1>
                <p className="text-violet-100 text-sm">
                  Join us and start your journey today
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRegistrationForm} className="p-8 space-y-5">
                {/* Username Field */}
                <div className="relative group">
                  <label
                    htmlFor="userName"
                    className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                      focusedField === "userName" || registerData.userName
                        ? "-top-2.5 text-xs text-violet-600 font-semibold"
                        : "top-3.5 text-sm text-gray-500"
                    }`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors duration-200">
                      <User className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      required
                      autoComplete="name"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-200"
                      value={registerData.userName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("userName")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <label
                    htmlFor="email"
                    className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                      focusedField === "email" || registerData.email
                        ? "-top-2.5 text-xs text-violet-600 font-semibold"
                        : "top-3.5 text-sm text-gray-500"
                    }`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors duration-200">
                      <Mail className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-200"
                      value={registerData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative group">
                  <label
                    htmlFor="phoneNumber"
                    className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                      focusedField === "phoneNumber" || registerData.phoneNumber
                        ? "-top-2.5 text-xs text-violet-600 font-semibold"
                        : "top-3.5 text-sm text-gray-500"
                    }`}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors duration-200">
                      <Phone className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      autoComplete="tel"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-200"
                      value={registerData.phoneNumber}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("phoneNumber")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <label
                    htmlFor="password"
                    className={`absolute left-11 px-2 bg-white/90 rounded transition-all duration-200 pointer-events-none z-10 ${
                      focusedField === "password" || registerData.password
                        ? "-top-2.5 text-xs text-violet-600 font-semibold"
                        : "top-3.5 text-sm text-gray-500"
                    }`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors duration-200">
                      <Lock className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      autoComplete="new-password"
                      className="w-full pl-12 pr-12 py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-200"
                      value={registerData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors duration-200 focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" strokeWidth={2} />
                      ) : (
                        <Eye className="w-5 h-5" strokeWidth={2} />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {registerData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Password strength:</span>
                        <span className={`text-xs font-semibold ${
                          currentStrength.strength === 4 ? 'text-green-600' :
                          currentStrength.strength === 3 ? 'text-yellow-600' :
                          currentStrength.strength === 2 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {currentStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${currentStrength.color}`}
                          style={{ width: `${(currentStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group mt-6"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    )}
                  </span>
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>

              {/* Footer */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-4 text-center border-t border-gray-200">
                <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Your information is safe and secure
                </p>
              </div>
            </div>
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
      `}</style>
    </div>
  );
}