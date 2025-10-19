"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SellerSidebar() {
  const router = useRouter();
  const [stallInfo, setStallInfo] = useState(null);

  useEffect(() => {
    const cookieValue = Cookies.get("stallInfo");
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue);
        setStallInfo(parsed);
      } catch {
        setStallInfo(null);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("stallInfo");
    router?.push("/");
  };

  if (!stallInfo) return null;

  return (
    <aside className="z-20 w-64 bg-white p-4 shadow-md fixed">
      <h2 className="text-blue-600 font-bold text-xl mb-4">Control Panel</h2>
      <nav className="space-y-2">
        <Link
          href="/seller/dashboard"
          className="block text-blue-600 hover:underline"
        >
          Dashboard
        </Link>
        <Link
          href="/seller/products"
          className="block text-blue-600 hover:underline"
        >
          My Products
        </Link>
        <Link
          href="/seller/feedback"
          className="block text-blue-600 hover:underline"
        >
          Feedback (⭐)
        </Link>
        <Link
          href="/seller/orders"
          className="block text-blue-600 hover:underline"
        >
          My Order
        </Link>
        <Link
          href="/seller/change-password"
          className="block text-blue-600 hover:underline"
        >
          Change Password
        </Link>
        <Link
          href="/seller/stall-request"
          className="block text-blue-600 hover:underline"
        >
          My Stall
        </Link>
        <button
          onClick={handleLogout}
          className="block text-red-600 hover:underline text-left w-full"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
