"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useGetAllProductsQuery } from "@/app/api/productSlice";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import "swiper/css";
import "swiper/css/free-mode";
import Link from "next/link";
import TkIcon from "@/public/TkIcon";

export default function CategoryProducts() {
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  // Error states
  if (productsError || categoriesError) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8 border-2 border-red-200 bg-red-50 text-red-700 rounded-2xl shadow-lg mb-10">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-3">Failed to load products</h2>
        <p className="text-lg">Please try again later or contact support if the problem persists.</p>
      </div>
    );
  }

  const getCategoryProducts = (categoryId) => {
    return (
      productsData?.products
        ?.filter((product) => product.category === categoryId)
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.slice(0, 8) || []
    );
  };

  // Loading skeleton
  if (categoriesLoading || productsLoading) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-16">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <div className="h-8 w-48 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-1 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-12 w-40 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative pt-[100%] bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {categoriesData?.map((category) => {
          const categoryProducts = getCategoryProducts(category._id);

          if (!categoryProducts.length) return null;

          return (
            <section key={category._id} className="mb-16">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-10">
                <div className="">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {category.name} <span className="text-green-600">Products</span>
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
                </div>

                {/* View All Button */}
                <Link href={`/category/${category._id}`}>
                  <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    View All Products →
                  </button>
                </Link>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                {categoryProducts.map((item) => {
                  const discountedPrice = (
                    item.price -
                    (item.discountPercent / 100) * item.price
                  ).toFixed(2);

                  return (
                    <div
                      key={item._id}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                    >
                      {/* Discount Badge */}
                      {item?.discountPercent > 0 && (
                        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                          -{item.discountPercent}%
                        </div>
                      )}

                      {/* Quick Action Buttons */}
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="bg-white p-2 rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Image */}
                      <div className="relative overflow-hidden bg-gray-100">
                        <div className="relative pt-[100%]">
                          <img
                            src={item.images[0]}
                            alt={item.productName}
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Product Name */}
                        <h3 className="text-gray-800 font-semibold mb-3 text-sm md:text-base line-clamp-2 min-h-[2.5rem] group-hover:text-green-600 transition-colors duration-300">
                          {item.productName?.split(" ").slice(0, 4).join(" ") +
                            (item.productName?.split(" ").length > 4 ? "..." : "")}
                        </h3>

                        {/* Price Section */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-green-600 font-bold text-lg md:text-xl flex items-center">
                              <TkIcon
                                size="18px"
                                color="#16a34a"
                                className="mr-1"
                              />
                              {discountedPrice}
                            </span>
                          </div>
                          {item.discountPercent > 0 && (
                            <div className="flex items-center">
                              <span className="text-gray-400 text-xs md:text-sm line-through flex items-center">
                                <TkIcon
                                  size="12px"
                                  color="#9ca3af"
                                  className="mr-0.5"
                                />
                                {item.price}
                              </span>
                              <span className="ml-2 text-xs text-green-600 font-medium">
                                Save ৳{(item.price - discountedPrice).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex flex-col self-end">
                          <Link href={`/client/product/${item._id}`} className="w-full">
                            <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                              <ShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
                              <span>Add to Cart</span>
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}