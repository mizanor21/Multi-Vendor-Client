"use client";

import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import { useVerifyCodeMutation } from "@/app/api/authSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function VerifyResetCode() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const email = Cookies?.get("resetUserEmail");
  const [verifyCode, { isLoading }] = useVerifyCodeMutation();

  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (!value && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.includes("")) {
      return setError("Please fill in all fields.");
    }

    const code = otp.join("");
    setError("");
    setMessage("");

    try {
      const formData = {
        email: email,
        code: code,
      };
      const res = await verifyCode(formData);

      if (res?.data) {
        router?.push("/auth/resetPassword");

        Swal.fire({
          title: "OTP verified. You may now reset your password.",
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: "Your OTP couldn't verified successfully.",
          icon: "error",
          draggable: true,
        });
      }

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Verify Reset Code
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex justify-between gap-2">
            {otp?.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-10 h-12 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </main>
  );
}
