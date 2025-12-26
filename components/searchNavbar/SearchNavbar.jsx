"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
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
} from "@heroui/react";
import { useGetASingleUserQuery } from "@/app/api/authSlice";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  Star,
  Tag,
  Package,
  ChevronRight,
  Sparkles
} from "lucide-react";
import CategoryNavbar from "../landingPage/categoryNavbar/CategoryNavbar";

export default function SearchNavbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  const loginInfo = Cookies?.get("loginInfo");
  const email = loginInfo;

  const {
    data: searchData,
    isError,
    isFetching,
  } = useSearchProductsQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  const { data: getASingleUserProfile } = useGetASingleUserQuery(email);
  const { data: getAllProductsOfCart } = useGetCartProductsQuery();

  const products = searchData?.products || [];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300);

    setShowResults(true);
  }, []);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((term) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  }, [recentSearches]);

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    if (inputValue.trim()) {
      saveRecentSearch(inputValue.trim());
      router.push(`/search?q=${encodeURIComponent(inputValue)}`);
      setShowResults(false);
      setIsSearchFocused(false);
    }
  }, [inputValue, router, saveRecentSearch]);

  // Handle product click
  const handleProductClick = useCallback((product) => {
    saveRecentSearch(product.productName);
    router.push(`/client/product/${product._id}`);
    setShowResults(false);
    setIsSearchFocused(false);
    setInputValue("");
    setSearchTerm("");
  }, [router, saveRecentSearch]);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((term) => {
    setInputValue(term);
    setSearchTerm(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setShowResults(false);
    setIsSearchFocused(false);
  }, [router]);

  // Clear search
  const clearSearch = useCallback(() => {
    setInputValue("");
    setSearchTerm("");
    setShowResults(false);
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }, []);

  // Handle logout
  const handleLogout = () => {
    Cookies?.remove("loginInfo");
    window.location?.reload();
  };

  return (
    <>
      {/* Backdrop overlay when search is focused */}
      {isSearchFocused && showResults && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] animate-fadeIn"
          onClick={() => {
            setShowResults(false);
            setIsSearchFocused(false);
          }}
        />
      )}

      {/* Main Navbar */}
      <div
        className={`w-full fixed top-0 left-0 right-0 z-[999] transition-all duration-300 bg-white`}
      >
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Top Bar - Mobile */}
            <div className="flex justify-between items-center py-3 gap-3">
              <CategoryNavbar />
              {/* Logo */}
              <Link href="/" className="">
                <Image
                  alt="Logo"
                  src="https://i.postimg.cc/pp2RnKSh/multi-vendor-e-com.jpg"
                  width={120}
                  height={35}
                  className=""
                />
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Sell Button */}
                <Tooltip content="Become a Seller" placement="bottom">
                  <Link href="/seller/dashboard">
                    <Button
                      isIconOnly
                      size="sm"
                      className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <SellIcon />
                    </Button>
                  </Link>
                </Tooltip>

                {/* Cart Button */}
                <Badge
                  color="danger"
                  content={getAllProductsOfCart?.length || 0}
                  size="sm"
                  shape="circle"
                  className="font-semibold"
                >
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-shadow"
                    onPress={() => router.push("/client/cart")}
                  >
                    <CartIcon size="18px" color="#ffffff" />
                  </Button>
                </Badge>

                {/* User Menu / Login */}
                {loginInfo ? (
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Avatar
                        isBordered
                        as="button"
                        size="sm"
                        color="primary"
                        className="transition-transform hover:scale-110"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                        <Link href="/client/profile">
                          <p className="font-semibold text-xs text-gray-500">Signed in as</p>
                          <p className="font-bold text-blue-600">
                            {getASingleUserProfile?.userName || "User"}
                          </p>
                        </Link>
                      </DropdownItem>
                      <DropdownItem key="orders" textValue="Orders">
                        <Link href="/client/orders">My Orders</Link>
                      </DropdownItem>
                      <DropdownItem key="wishlist" textValue="Wishlist">
                        <Link href="/client/wishlist">Wishlist</Link>
                      </DropdownItem>
                      <DropdownItem key="logout" color="danger" onPress={handleLogout} textValue="Logout">
                        Log Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      isIconOnly
                      size="sm"
                      className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <LoginIcon />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Search Bar - Mobile */}
            <div className="pb-3 relative" ref={searchRef}>
              <div className="relative">
                <Input
                  placeholder="Search products, brands..."
                  value={inputValue}
                  startContent={
                    <Search className={`w-5 h-5 transition-colors ${isSearchFocused ? "text-blue-600" : "text-gray-400"
                      }`} />
                  }
                  endContent={
                    inputValue && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )
                  }
                  type="text"
                  size="md"
                  className="w-full"
                  classNames={{
                    input: "text-sm placeholder:text-gray-400",
                    inputWrapper: `${isSearchFocused
                      ? "border-2 border-blue-500 shadow-lg bg-white"
                      : "border border-gray-200 bg-gray-50 hover:bg-white"
                      } transition-all duration-300`,
                  }}
                  onChange={handleInputChange}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowResults(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                />
              </div>

              {/* Search Results Dropdown - Mobile */}
              {showResults && (
                <div className="absolute z-[1000] mt-2 w-full bg-white rounded-md shadow-2xl border border-gray-200 max-h-[70vh] overflow-hidden animate-slideDown">
                  <div className="overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {isFetching ? (
                      <div className="flex flex-col justify-center items-center p-12">
                        <Spinner size="lg" color="primary" />
                        <p className="mt-4 text-sm text-gray-500">Searching...</p>
                      </div>
                    ) : searchTerm.length < 2 ? (
                      <div className="p-4">
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between px-2 py-2 mb-2">
                              <div className="flex items-center gap-2 text-gray-700 text-sm font-bold">
                                <Clock className="w-4 h-4 text-blue-600" />
                                Recent Searches
                              </div>
                              <button
                                onClick={clearRecentSearches}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Clear All
                              </button>
                            </div>
                            <div className="space-y-1">
                              {recentSearches.map((term, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleRecentSearchClick(term)}
                                  className="w-full flex items-center gap-3 text-left px-3 py-2.5 hover:bg-blue-50 rounded-md transition-colors group"
                                >
                                  <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                  <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                                    {term}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Links */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 px-2 py-2 text-gray-700 text-sm font-bold">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Quick Links
                          </div>
                          <Link
                            href="/deals"
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-md transition-colors group"
                            onClick={() => setShowResults(false)}
                          >
                            <Tag className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                            <span className="text-gray-700 group-hover:text-green-600 font-medium">
                              Today's Deals
                            </span>
                          </Link>
                          <Link
                            href="/new-arrivals"
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 rounded-md transition-colors group"
                            onClick={() => setShowResults(false)}
                          >
                            <Package className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                            <span className="text-gray-700 group-hover:text-purple-600 font-medium">
                              New Arrivals
                            </span>
                          </Link>
                        </div>
                      </div>
                    ) : isError ? (
                      <div className="flex flex-col items-center justify-center p-12">
                        <div className="w-16 h-16 bg-red-100 rounded-md flex items-center justify-center mb-4">
                          <X className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-red-600 font-semibold text-lg mb-2">No products found</p>
                        <p className="text-gray-500 text-sm">Try different keywords</p>
                      </div>
                    ) : products?.length ? (
                      <div>
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700 font-bold">
                              {products.length} Result{products.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <button
                            onClick={() => router.push(`/search?q=${encodeURIComponent(searchTerm)}`)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                          >
                            View All
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        {products.slice(0, 5).map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all cursor-pointer border-b border-gray-100 last:border-b-0 group"
                            onClick={() => handleProductClick(product)}
                          >
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={product.images[0] || "/placeholder-product.jpg"}
                                alt={product.productName}
                                className="rounded-md object-cover w-full h-full shadow-sm group-hover:shadow-md transition-shadow"
                              />
                              {product.discountPercent > 0 && (
                                <div className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-md">
                                  {product.discountPercent}%
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {product.productName}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-blue-600">
                                  ${product.price}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>
                              {product.rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-xs text-gray-600 font-medium">
                                    {product.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-base font-medium mb-1">
                          No products found
                        </p>
                        <p className="text-gray-400 text-sm">
                          Try searching with different keywords
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-8 lg:py-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                alt="Logo"
                src="https://i.postimg.cc/pp2RnKSh/multi-vendor-e-com.jpg"
                width={180}
                height={45}
                className="object-contain hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-3xl relative" ref={searchRef}>
              <div className="relative">
                <Input
                  placeholder="Search for products, brands and more..."
                  value={inputValue}
                  startContent={
                    <Search className={`w-5 h-5 transition-colors ${isSearchFocused ? "text-blue-600" : "text-gray-400"
                      }`} />
                  }
                  endContent={
                    inputValue && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-md"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )
                  }
                  type="text"
                  size="lg"
                  className="w-full"
                  classNames={{
                    input: "text-base placeholder:text-gray-400",
                    inputWrapper: `${isSearchFocused
                      ? "border-2 border-blue-500 shadow-xl bg-white"
                      : "border border-gray-200 bg-gray-50 hover:bg-white"
                      } transition-all duration-300`,
                  }}
                  onChange={handleInputChange}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowResults(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                />
              </div>

              {/* Search Results Dropdown - Desktop */}
              {showResults && (
                <div className="absolute z-[1000] mt-3 w-full bg-white rounded-md shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden animate-slideDown">
                  <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                    {isFetching ? (
                      <div className="flex flex-col justify-center items-center p-16">
                        <Spinner size="lg" color="primary" />
                        <p className="mt-4 text-gray-500">Searching products...</p>
                      </div>
                    ) : searchTerm.length < 2 ? (
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Recent Searches */}
                          <div>
                            {recentSearches.length > 0 && (
                              <>
                                <div className="flex items-center justify-between px-2 py-2 mb-3">
                                  <div className="flex items-center gap-2 text-gray-700 text-sm font-bold">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    Recent Searches
                                  </div>
                                  <button
                                    onClick={clearRecentSearches}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                  >
                                    Clear All
                                  </button>
                                </div>
                                <div className="space-y-1">
                                  {recentSearches.map((term, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleRecentSearchClick(term)}
                                      className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-blue-50 rounded-md transition-colors group"
                                    >
                                      <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                      <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                                        {term}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Quick Links */}
                          <div>
                            <div className="flex items-center gap-2 px-2 py-2 mb-3 text-gray-700 text-sm font-bold">
                              <Sparkles className="w-5 h-5 text-amber-500" />
                              Quick Links
                            </div>
                            <div className="space-y-1">
                              <Link
                                href="/deals"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-md transition-colors group"
                                onClick={() => setShowResults(false)}
                              >
                                <Tag className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                                <span className="text-gray-700 group-hover:text-green-600 font-medium">
                                  Today's Deals
                                </span>
                              </Link>
                              <Link
                                href="/new-arrivals"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-md transition-colors group"
                                onClick={() => setShowResults(false)}
                              >
                                <Package className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                                <span className="text-gray-700 group-hover:text-purple-600 font-medium">
                                  New Arrivals
                                </span>
                              </Link>
                              <Link
                                href="/bestsellers"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 rounded-md transition-colors group"
                                onClick={() => setShowResults(false)}
                              >
                                <Star className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                                <span className="text-gray-700 group-hover:text-orange-600 font-medium">
                                  Best Sellers
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : isError ? (
                      <div className="flex flex-col items-center justify-center p-16">
                        <div className="w-20 h-20 bg-red-100 rounded-md flex items-center justify-center mb-4">
                          <X className="w-10 h-10 text-red-600" />
                        </div>
                        <p className="text-red-600 font-semibold text-xl mb-2">No products found</p>
                        <p className="text-gray-500">Try searching with different keywords</p>
                      </div>
                    ) : products?.length ? (
                      <div>
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700 font-bold text-lg">
                              {products.length} Result{products.length !== 1 ? 's' : ''} found
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                              setShowResults(false);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
                          >
                            View All Results
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                        {products.slice(0, 6).map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-6 p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all cursor-pointer border-b border-gray-100 last:border-b-0 group"
                            onClick={() => handleProductClick(product)}
                          >
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <Image
                                src={product.images[0] || "/placeholder-product.jpg"}
                                alt={product.productName}
                                className="rounded-md object-cover w-full h-full shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300"
                              />
                              {product.discountPercent > 0 && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                                  {product.discountPercent}% OFF
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {product.productName}
                              </h3>
                              <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-2xl font-bold text-blue-600">
                                  ${product.price}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>
                              {product.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                  <span className="text-sm text-gray-600 font-medium">
                                    {product.rating}
                                  </span>
                                  {product.reviewCount && (
                                    <span className="text-xs text-gray-400">
                                      ({product.reviewCount} reviews)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
                          <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium mb-2">
                          No products found for "{searchTerm}"
                        </p>
                        <p className="text-gray-400">
                          Try using different or more general keywords
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Desktop */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Sell Button */}
              <Link href="/seller/login">
                <Button
                  startContent={<SellIcon />}
                  className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all hover:scale-105 px-6 rounded-md"
                  size="lg"
                >
                  Sell
                </Button>
              </Link>

              {/* Cart Button */}
              <Badge
                color="danger"
                content={getAllProductsOfCart?.length || 0}
                shape="circle"
                className="font-bold"
              >
                <Button
                  startContent={<CartIcon size="20px" color="#ffffff" />}
                  className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all hover:scale-105 px-6 rounded-md"
                  size="lg"
                  onPress={() => router.push("/client/cart")}
                >
                  Cart
                </Button>
              </Badge>

              {/* Points Button */}
              <Badge color="warning" content="0" shape="circle" className="font-bold">
                <Button
                  startContent={<PointsIcon />}
                  className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-all hover:scale-105 px-6 rounded-md"
                  size="lg"
                >
                  Points
                </Button>
              </Badge>

              {/* User Menu / Login */}
              {loginInfo ? (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform hover:scale-110"
                      color="primary"
                      size="lg"
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                      <Link href="/client/profile">
                        <p className="font-semibold text-xs text-gray-500">Signed in as</p>
                        <p className="font-bold text-blue-600">
                          {getASingleUserProfile?.userName || "User"}
                        </p>
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="orders" textValue="Orders">
                      <Link href="/client/orders">My Orders</Link>
                    </DropdownItem>
                    <DropdownItem key="wishlist" textValue="Wishlist">
                      <Link href="/client/wishlist">Wishlist</Link>
                    </DropdownItem>
                    <DropdownItem key="settings" textValue="Settings">
                      <Link href="/client/settings">Settings</Link>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={handleLogout} textValue="Logout">
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Link href="/auth/login">
                  <Button
                    startContent={<LoginIcon />}
                    className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all hover:scale-105 px-6 rounded-md"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden xl:block">

        <CategoryNavbar />
      </div>


      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[50px]"></div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #6366f1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #4f46e5);
        }
      `}</style>
    </>
  );
}