"use client";
import {
  useResendVerifyCodeMutation,
  useVerifyEmailByCodeMutation,
} from "@/app/api/authSlice";
import Cookies from "js-cookie";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendTime, setResendTime] = useState(1);
  const inputRefs = useRef([]);
  const router = useRouter();

  const email = Cookies?.get("registeredEmail");

  const [verifyEmailByCode] = useVerifyEmailByCodeMutation();

  const [resendVerifyCode, { isLoading }] = useResendVerifyCodeMutation();

  // Handle input change
  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus to next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const pastedCode = pastedData.split("");
      setCode(pastedCode);
      inputRefs.current[5].focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    const formData = {
      email: email,
      code: verificationCode,
    };

    try {
      const res = await verifyEmailByCode(formData);
      if (res?.data) {
        router?.push("/auth/login");
        Swal.fire({
          title: res?.data?.message,
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.error,
          icon: "error",
          draggable: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (resendTime > 0) {
      timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTime]);

  // Resend verification code
  const handleResend = async () => {
    setIsResendDisabled(true);
    setResendTime(1);
    const verifyEmail = {
      email: email,
    };
    try {
      const res = await resendVerifyCode(verifyEmail);
      if (res?.data) {
        Swal.fire({
          title: res?.data?.message,
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.error,
          icon: "error",
          draggable: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <div className="mt-10 container mx-auto">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit verification code to your email
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-md sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="verification-code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification code
                </label>
                <div className="mt-2 flex space-x-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Verify
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Didn't receive a code?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleResend}
                  disabled={isResendDisabled}
                  className={`font-medium text-sm ${
                    isResendDisabled
                      ? "text-gray-400"
                      : "text-blue-600 hover:text-blue-500"
                  }`}
                >
                  {isResendDisabled
                    ? `Resend code in ${resendTime}s`
                    : "Resend verification code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
