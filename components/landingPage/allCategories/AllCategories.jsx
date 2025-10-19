"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Button, Card, CardFooter, Image, Skeleton } from "@heroui/react";
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
      <div className="container mx-auto px-4 text-center py-10">
        <h2 className="text-red-500 text-xl">
          Error loading products. Please try again later.
        </h2>
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
        ?.slice(0, 8) || [] // Changed from 10 to 8
    );
  };

  // Loading skeleton
  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-12">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, j) => (
                <Card key={j}>
                  <Skeleton className="h-48 rounded-none" />
                  <CardFooter className="block space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full mt-2" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {categoriesData?.map((category) => {
        const categoryProducts = getCategoryProducts(category._id);

        if (!categoryProducts.length) return null;

        return (
          <section key={category._id} className="mb-12 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
              {/* Updated Button with Link to category page */}
              <Link href={`/category/${category._id}`}>
                <Button
                  variant="light"
                  className="text-green-600 hover:underline font-medium"
                >
                  See All ➔
                </Button>
              </Link>
            </div>

            <Swiper
              slidesPerView={1.2}
              spaceBetween={16}
              freeMode
              modules={[FreeMode]}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 28,
                },
              }}
            >
              {categoryProducts.map((product) => (
                <SwiperSlide key={product._id} className="h-auto pb-2">
                  <Link href={`/client/product/${product._id}`}>
                    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-100">
                      {/* Discount Badge */}
                      {product?.discountPercent > 0 && (
                        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discountPercent}% OFF
                        </div>
                      )}

                      {/* Product Image */}
                      <div className="relative pt-[100%] overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.productName}
                          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-gray-800 font-medium mb-2 text-sm md:text-base line-clamp-2">
                          {product.productName
                            ?.split(" ")
                            .slice(0, 3)
                            .join(" ") +
                            (product.productName?.split(" ").length > 3
                              ? "..."
                              : "")}{" "}
                        </h3>

                        {/* Price Section */}
                        <div className="mt-auto">
                          <div className="flex items-center">
                            <span className="text-green-600 font-bold text-lg flex items-center">
                              <TkIcon
                                size="20px"
                                color="#16a34a"
                                className="w-4 h-4 mr-1"
                              />
                              {(
                                product.price -
                                (product.discountPercent / 100) * product.price
                              ).toFixed(2)}
                            </span>
                            {product.discountPercent > 0 && (
                              <span className="text-gray-400 text-sm line-through ml-2 flex items-center">
                                <TkIcon
                                  size="16px"
                                  color="#9ca3af"
                                  className="w-3 h-3 mr-0.5"
                                />
                                {product.price}
                              </span>
                            )}
                          </div>

                          <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        );
      })}
    </div>
  );
}
