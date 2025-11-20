"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/app/api/authSlice";

export default function ResetPage() {
  const router = useRouter();
  const email = Cookies?.get("resetUserEmail");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    const formData = {
      email: email,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    try {
      const res = await resetPassword(formData);

      if (res?.data) {
        Swal.fire({
          title: "Password reset successful!",
          icon: "success",
          draggable: true,
        }).then(() => {
          window.location.href = "/auth/login";
        });
      } else {
        Swal.fire({
          title: "Password not reset.",
          icon: "error",
          draggable: true,
        });
      }

      setMessage(res.data.message);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Your Password
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border-2 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full border-2 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          {message && (
            <p className="text-green-600 text-center text-sm">{message}</p>
          )}
          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        </form>
      </div>
    </main>
  );
}
