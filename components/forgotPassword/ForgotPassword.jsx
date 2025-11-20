"use client";
import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/app/api/authSlice";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await forgotPassword({ email });
      if (res?.data) {
        Cookies.set("resetUserEmail", email, { expires: 24 });
        router?.push("/auth/verifyResetCode");
        Swal?.fire({
          title: "OTP sent to your email address",
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: "OTP sending failed!",
          icon: "error",
          draggable: true,
        });
      }
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setEmail("");
    }
  };

  return (
    <main className="nuni container mx-auto h-screen w-full">
      <div className="w-full h-screen mx-auto p-6 flex justify-center items-center">
        <div className="mt-7 bg-white rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7 w-96">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remember your password?
                <Link
                  className="ms-1 text-blue-600 decoration-2 hover:underline font-medium"
                  href="/auth/login"
                >
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                  >
                    {isLoading ? "Sending OTP..." : "Reset password"}
                  </button>

                  {message && (
                    <p className="text-sm text-green-600 text-center">
                      {message}
                    </p>
                  )}
                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
