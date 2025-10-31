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
} from "@heroui/react";
import { useGetASingleUserQuery } from "@/app/api/authSlice";
import { Search, X, TrendingUp, Clock } from "lucide-react";

export default function SearchNavbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

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

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
    setShowResults(true);
  };

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

  const saveRecentSearch = (term) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearchSubmit = () => {
    if (inputValue.trim()) {
      saveRecentSearch(inputValue.trim());
      router.push(`/search?q=${encodeURIComponent(inputValue)}`);
      setShowResults(false);
      setIsSearchFocused(false);
    }
  };

  const handleProductClick = (product) => {
    saveRecentSearch(product.productName);
    router.push(`/client/product/${product._id}`);
    setShowResults(false);
    setIsSearchFocused(false);
    setInputValue("");
    setSearchTerm("");
  };

  const handleRecentSearchClick = (term) => {
    setInputValue(term);
    setSearchTerm(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setShowResults(false);
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    setShowResults(false);
  };

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
    <>
      {isSearchFocused && showResults && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000] animate-fadeIn"
          onClick={() => {
            setShowResults(false);
            setIsSearchFocused(false);
          }}
        />
      )}

      <div
        className={`w-full fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-xl"
            : "bg-white shadow-md"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-3">
              <Link href="/" className="flex-shrink-0">
                <Image
                  alt="Logo"
                  src="https://i.postimg.cc/pp2RnKSh/multi-vendor-e-com.jpg"
                  width={140}
                  height={40}
                  className="object-contain"
                />
              </Link>

              <div className="flex gap-2">
                <Link href="/seller/dashboard">
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  >
                    <SellIcon />
                  </Button>
                </Link>
                <Badge
                  color="danger"
                  content={getAllProductsOfCart?.length || 0}
                  size="sm"
                  className="animate-pulse"
                >
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    onPress={() => router.push("/client/cart")}
                  >
                    <CartIcon size="18px" color="#ffffff" />
                  </Button>
                </Badge>
                {loginInfo ? (
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Avatar
                        isBordered
                        as="button"
                        size="sm"
                        className="transition-transform hover:scale-110"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem key="profile" className="h-14 gap-2">
                        <Link href="/client/profile">
                          <p className="font-semibold">Signed in as</p>
                          <p className="font-semibold text-blue-600">
                            {getASingleUserProfile?.userName}
                          </p>
                        </Link>
                      </DropdownItem>
                      <DropdownItem key="orders">
                        <Link href="/client/orders">My Orders</Link>
                      </DropdownItem>
                      <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                        Log Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      isIconOnly
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    >
                      <LoginIcon />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="pb-3 relative" ref={searchRef}>
              <div className="relative">
                <Input
                  placeholder="Search products..."
                  value={inputValue}
                  startContent={<Search className="w-5 h-5 text-gray-400" />}
                  endContent={
                    inputValue && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )
                  }
                  type="text"
                  size="md"
                  className="w-full"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: `${
                      isSearchFocused
                        ? "border-2 border-blue-500 shadow-lg"
                        : "border border-gray-200"
                    }`,
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

              {showResults && (
                <div className="absolute z-[60] mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] overflow-hidden animate-slideDown">
                  <div className="overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {isFetching ? (
                      <div className="flex justify-center items-center p-8">
                        <Spinner size="md" color="primary" />
                      </div>
                    ) : searchTerm.length < 2 ? (
                      <div className="p-4">
                        {recentSearches.length > 0 && (
                          <>
                            <div className="flex items-center gap-2 px-2 py-2 text-gray-600 text-sm font-semibold">
                              <Clock className="w-4 h-4" />
                              Recent Searches
                            </div>
                            {recentSearches.map((term, index) => (
                              <button
                                key={index}
                                onClick={() => handleRecentSearchClick(term)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-gray-700"
                              >
                                {term}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    ) : isError ? (
                      <div className="flex flex-col items-center justify-center p-8">
                        <p className="text-red-600 font-semibold">No products found</p>
                      </div>
                    ) : products?.length ? (
                      <div>
                        <div className="flex items-center gap-2 px-4 py-3 text-gray-600 text-sm font-semibold border-b">
                          <TrendingUp className="w-4 h-4" />
                          Search Results ({products.length})
                        </div>
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleProductClick(product)}
                          >
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={product.images[0] || "/placeholder-product.jpg"}
                                alt={product.productName}
                                className="rounded-lg object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {product.productName}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-blue-600">
                                  ${product.price}
                                </span>
                                {product.discountPercent > 0 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                    {product.discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No products found for "{searchTerm}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex md:items-center md:justify-between md:py-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                alt="Logo"
                src="https://i.postimg.cc/pp2RnKSh/multi-vendor-e-com.jpg"
                width={200}
                height={50}
                className="object-contain"
              />
            </Link>

            <div className="flex-1 max-w-3xl mx-8 relative" ref={searchRef}>
              <div className="relative">
                <Input
                  placeholder="Search for products, brands and more..."
                  value={inputValue}
                  startContent={<Search className="w-5 h-5 text-gray-400" />}
                  endContent={
                    inputValue && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )
                  }
                  type="text"
                  size="lg"
                  className="w-full"
                  classNames={{
                    inputWrapper: `${
                      isSearchFocused
                        ? "border-2 border-blue-500 shadow-xl"
                        : "border border-gray-200"
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

              {showResults && (
                <div className="absolute z-[60] mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden animate-slideDown">
                  <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                    {isFetching ? (
                      <div className="flex justify-center items-center p-12">
                        <Spinner size="lg" color="primary" />
                      </div>
                    ) : searchTerm.length < 2 ? (
                      <div className="p-6">
                        {recentSearches.length > 0 && (
                          <>
                            <div className="flex items-center gap-2 px-2 py-2 text-gray-600 text-sm font-semibold mb-2">
                              <Clock className="w-5 h-5" />
                              Recent Searches
                            </div>
                            <div className="space-y-1">
                              {recentSearches.map((term, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleRecentSearchClick(term)}
                                  className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors text-gray-700 font-medium"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : isError ? (
                      <div className="flex flex-col items-center justify-center p-12">
                        <p className="text-red-600 font-semibold text-lg">
                          No products found
                        </p>
                      </div>
                    ) : products?.length ? (
                      <div>
                        <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700 font-semibold">
                            Search Results ({products.length})
                          </span>
                        </div>
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-6 p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all cursor-pointer border-b border-gray-100 last:border-b-0 group"
                            onClick={() => handleProductClick(product)}
                          >
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <Image
                                src={product.images[0] || "/placeholder-product.jpg"}
                                alt={product.productName}
                                className="rounded-xl object-cover w-full h-full group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                                {product.productName}
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-blue-600">
                                  ${product.price}
                                </span>
                                {product.discountPercent > 0 && (
                                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                    {product.discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <p className="text-gray-500 text-lg">
                          No products found for "{searchTerm}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/seller/dashboard">
                <Button
                  startContent={<SellIcon />}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-shadow"
                >
                  Sell
                </Button>
              </Link>
              <Badge
                color="danger"
                content={getAllProductsOfCart?.length || 0}
                className="animate-pulse"
              >
                <Button
                  startContent={<CartIcon size="20px" color="#ffffff" />}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-shadow"
                  onPress={() => router.push("/client/cart")}
                >
                  Cart
                </Button>
              </Badge>
              <Badge color="warning" content="0">
                <Button
                  startContent={<PointsIcon />}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-shadow"
                >
                  Points
                </Button>
              </Badge>
              {loginInfo ? (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform hover:scale-110"
                      color="primary"
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <Link href="/client/profile">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold text-blue-600">
                          {getASingleUserProfile?.userName}
                        </p>
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="orders">
                      <Link href="/client/orders">My Orders</Link>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Link href="/auth/login">
                  <Button
                    startContent={<LoginIcon />}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-shadow"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[120px] md:h-[88px]"></div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
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
          animation: slideDown 0.3s ease-out;
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