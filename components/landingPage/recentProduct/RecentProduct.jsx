"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import Link from "next/link";
import { useGetAllProductsQuery } from "@/app/api/productSlice";
import TkIcon from "@/public/TkIcon";
import { Spinner } from "@heroui/spinner";

export default function RecentProduct() {
  const {
    data: getAllProductData,
    isLoading,
    isError,
  } = useGetAllProductsQuery();

  const approvedProducts = getAllProductData?.products
    ?.filter((item) => item?.approvalStatus === "approved")
    ?.slice(-8)
    .reverse();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl mt-10 mb-6 font-bold text-center md:text-left">
        Recent Products
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-500">Loading products...</p>
        </div>
      ) : isError ? (
        <div className="w-full text-center p-6 border border-red-300 bg-red-50 text-red-700 rounded-md shadow-sm mb-10">
          <h2 className="text-xl font-semibold mb-2">
            Failed to load products.
          </h2>
          <p>
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      ) : approvedProducts?.length === 0 ? (
        <div className="w-full text-center p-6 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-md shadow-sm mb-10">
          <h2 className="text-xl font-semibold mb-2">
            No approved products found.
          </h2>
          <p>
            New products will appear here once they are available and approved.
          </p>
        </div>
      ) : (
        <Swiper
          freeMode={true}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination]}
          className="mySwiper-recent-products pb-10"
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
          {approvedProducts?.map((item) => (
            <SwiperSlide key={item._id} className="h-auto pb-2">
              <Link href={`/client/product/${item._id}`}>
                <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-100">
                  {/* Discount Badge */}
                  {item?.discountPercent > 0 && (
                    <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.discountPercent}% OFF
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative pt-[100%] overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.productName}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-gray-800 font-medium mb-2 text-sm md:text-base line-clamp-2">
                      {item.productName?.split(" ").slice(0, 3).join(" ") +
                        (item.productName?.split(" ").length > 3
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
                            item.price -
                            (item.discountPercent / 100) * item.price
                          ).toFixed(2)}
                        </span>
                        {item.discountPercent > 0 && (
                          <span className="text-gray-400 text-sm line-through ml-2 flex items-center">
                            <TkIcon
                              size="14px"
                              color="#9ca3af"
                              className="w-3 h-3 mr-0.5"
                            />
                            {item.price}
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
      )}
    </div>
  );
}
