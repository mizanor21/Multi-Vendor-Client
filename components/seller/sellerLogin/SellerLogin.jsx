"use client";
import { useLoginStallMutation } from "@/app/api/stallSlice";
import { Button } from "@heroui/react";
import React, { useState } from "react";
import Swal from "sweetalert2";

import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import Link from "next/link";

export default function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [loginStall, { isLoading }] = useLoginStallMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    const formData = {
      email: email,
      password: password,
    };
    // console.log("formData");
    try {
      const res = await loginStall(formData).unwrap();
      // console.log(res);
      Cookies.set("stallInfo", JSON.stringify(res), { expires: 7 });
      if (res) {
        Swal.fire({
          title: "Logged in Successfully!",
          icon: "success",
          draggable: true,
        });
        router.push("/seller/stall-request");
        window.location.reload();
      } else {
        Swal.fire({
          title: "Login failed!",
          icon: "error",
          draggable: true,
        });
      }
    } catch (error) {
      // console.log("Login error:", error);
      Swal.fire({
        title:
          error?.data?.message || error?.data?.error || "Something went wrong",
        icon: "error",
        draggable: true,
      });
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Seller Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </Button>
        </form>
      </div>
      <p className="mt-4">
        If you have no account,{" "}
        <Link href="/seller/stall-request" className="text-blue-700">
          make a stall account first.
        </Link>
      </p>
    </div>
  );
}
