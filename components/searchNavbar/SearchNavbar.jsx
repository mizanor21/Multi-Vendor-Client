"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
import SearchIcon from "@/public/SearchIcon";
import LoginIcon from "@/public/LoginIcon";
import SellIcon from "@/public/SellIcon";
import CartIcon from "@/public/CartIcon";
import { Badge } from "@heroui/badge";
import PointsIcon from "@/public/PointsIcon";
import { useRouter } from "next/navigation";
import { useSearchProductsQuery } from "@/app/api/productSlice";
import { Spinner } from "@heroui/spinner";
import { useGetCartProductsQuery } from "@/app/api/cartApiSlice";
import Cookies from "js-cookie";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@heroui/react";
import { useGetASingleUserQuery } from "@/app/api/authSlice";

export default function SearchNavbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const loginInfo = Cookies?.get("loginInfo");

  const email = loginInfo;

  const {
    data: searchData,
    isError,
    isFetching,
  } = useSearchProductsQuery(searchTerm);

  const { data: getASingleUserProfile } = useGetASingleUserQuery(email);
  console.log("loginInfo", loginInfo);
  const { data: getAllProductsOfCart } = useGetCartProductsQuery();

  const products = searchData?.products || [];

  // Debounce search input
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
    setShowResults(value.length > 1);
  };

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/client/product/${productId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const handleLogout = () => {
    Cookies?.remove("loginInfo");
    window.location?.reload();
  };

  return (
    <div className="w-full bg-white shadow-sm" ref={searchRef}>
      {/* Fixed container for large screens only */}
      <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-50 lg:bg-white lg:shadow-md">
        {/* Mobile Layout (2 rows) - shown only on small screens */}
        <div className="md:hidden">
          {/* First Row: Logo + Buttons */}
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <Link href="/">
              <Image
                alt="Logo_image"
                src="https://i.postimg.cc/pp2RnKSh/multi-vendor-e-com.jpg"
                width={150}
              />
            </Link>

            <div className="flex gap-2">
              <Tooltip content="Sell Items">
                <Link href="/seller/dashboard">
                  <Button isIconOnly color="primary" size="sm">
                    <SellIcon />
                  </Button>
                </Link>
              </Tooltip>
              <Badge color="warning" content={getAllProductsOfCart?.length}>
                <Tooltip content="Cart Items">
                  <Button
                    isIconOnly
                    color="primary"
                    size="sm"
                    onPress={() => router.push("/client/cart")}
                  >
                    <CartIcon size="20px" color="#ffffff" />
                  </Button>
                </Tooltip>
              </Badge>
              <Tooltip content="Login">
                <Link href="/auth/login">
                  <Button isIconOnly color="primary" size="sm">
                    <LoginIcon />
                  </Button>
                </Link>
              </Tooltip>
            </div>
          </div>

          {/* Second Row: Search Field */}
          <div className="container mx-auto px-4 pb-3">
            <div className="relative w-full">
              <form onSubmit={handleSearch}>
                <Input
                  placeholder="Search a product..."
                  startContent={
                    <SearchIcon className="text-xl text-default-400 pointer-events-none" />
                  }
                  type="search"
                  size="md"
                  className="w-full"
                  onChange={handleInputChange}
                  onFocus={() => searchTerm.length > 1 && setShowResults(true)}
                />
              </form>

              {/* Search Results Dropdown (Mobile) */}
              {showResults && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-y-auto">
                  {isFetching ? (
                    <div className="flex justify-center p-4">
                      <Spinner size="sm" />
                    </div>
                  ) : isError ? (
                    <div className="flex justify-center p-4">
                      <p className="font-inter text-red-600 font-semibold">
                        No products found⛔
                      </p>
                    </div>
                  ) : products?.length ? (
                    <div>
                      {products.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
                          onClick={() => handleProductClick(product._id)}
                        >
                          <Image
                            src={
                              product.images[0] || "/placeholder-product.jpg"
                            }
                            alt={product.productName}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {product.productName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${product.price}
                              {product.discountPercent && (
                                <span className="ml-2 text-green-600">
                                  {product.discountPercent}% off
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-gray-500">
                      {searchTerm.length < 2
                        ? "Type at least 2 characters to search"
                        : "No products found"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout (single row) - shown only on medium screens and up */}
        <div className="hidden md:block">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-0 md:py-5">
            {/* Logo */}
            <div className="w-full flex justify-center md:w-auto md:justify-start">
              <Link href="/">
                <Image
                  alt="Logo_image"
                  src="https://i.postimg.cc/pp2RnKSh/multi-vendor-e-com.jpg"
                  width={200}
                />
              </Link>
            </div>

            {/* Search and Buttons */}
            <div className="flex flex-col gap-3 w-full md:flex-row md:items-center md:gap-3 md:justify-end">
              {/* Search Input Field */}
              <div className="relative w-full md:w-auto">
                <form onSubmit={handleSearch}>
                  <Input
                    placeholder="Search a product..."
                    startContent={
                      <SearchIcon className="text-2xl text-default-400 pointer-events-none" />
                    }
                    type="search"
                    size="lg"
                    className="w-full md:w-[450px] lg:w-[600px]"
                    onChange={handleInputChange}
                    onFocus={() =>
                      searchTerm.length > 1 && setShowResults(true)
                    }
                  />
                </form>

                {/* Search Results Dropdown */}
                {showResults && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-y-auto">
                    {isFetching ? (
                      <div className="flex justify-center p-4">
                        <Spinner size="sm" />
                      </div>
                    ) : isError ? (
                      <div className="flex justify-center p-4 text-red-500">
                        Error loading products.
                      </div>
                    ) : products?.length ? (
                      <div>
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
                            onClick={() => handleProductClick(product._id)}
                          >
                            <Image
                              src={
                                product.images[0] || "/placeholder-product.jpg"
                              }
                              alt={product.productName}
                              width={48}
                              height={48}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {product.productName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                ${product.price}
                                {product.discountPercent && (
                                  <span className="ml-2 text-green-600">
                                    {product.discountPercent}% off
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-gray-500">
                        {searchTerm.length < 2
                          ? "Type at least 2 characters to search"
                          : "No products found"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center md:justify-start">
                <Link href="/seller/dashboard">
                  <Button startContent={<SellIcon />} color="primary">
                    Sell Items
                  </Button>
                </Link>
                <Badge
                  color="warning"
                  content={getAllProductsOfCart?.length || 0}
                >
                  <Button
                    startContent={<CartIcon size="24px" color="#ffffff" />}
                    color="primary"
                    onPress={() => router.push("/client/cart")}
                  >
                    Cart
                  </Button>
                </Badge>
                <Badge color="warning" content="0">
                  <Button startContent={<PointsIcon />} color="primary">
                    Points
                  </Button>
                </Badge>
                {loginInfo ? (
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem key="profile" className="h-14 gap-2">
                        <Link href="/client/profile">
                          <p className="font-semibold">Signed in as</p>
                          <p className="font-semibold">
                            {getASingleUserProfile?.userName}
                          </p>
                        </Link>
                      </DropdownItem>

                      <DropdownItem key="orders">
                        <Link href="/client/orders">My Orders</Link>
                      </DropdownItem>

                      <DropdownItem
                        key="logout"
                        color="danger"
                        onPress={handleLogout}
                      >
                        Log Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <Tooltip content="Login">
                    <Link href="/auth/login">
                      <Button startContent={<LoginIcon />} color="primary">
                        Sign Up
                      </Button>
                    </Link>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for content to account for fixed navbar on large screens */}
      <div className="hidden lg:block lg:h-[88px]"></div>
    </div>
  );
}
