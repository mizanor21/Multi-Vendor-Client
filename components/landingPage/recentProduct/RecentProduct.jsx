"use client";
import React from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import Link from "next/link";

// Mock TkIcon component
const TkIcon = ({ size, color, className }) => (
  <span className={className} style={{ fontSize: size, color }}>৳</span>
);

export default function RecentProduct() {
  // Mock data for demonstration
  const approvedProducts = [
    {
      _id: "1",
      productName: "Premium Wireless Headphones with Noise Cancellation",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"],
      price: 5999,
      discountPercent: 25,
    },
    {
      _id: "2",
      productName: "Smart Watch Series 8 Pro",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
      price: 12999,
      discountPercent: 15,
    },
    {
      _id: "3",
      productName: "Leather Messenger Bag",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
      price: 3499,
      discountPercent: 0,
    },
    {
      _id: "4",
      productName: "Vintage Sunglasses Collection",
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"],
      price: 1299,
      discountPercent: 30,
    },
    {
      _id: "5",
      productName: "Professional Camera Lens",
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"],
      price: 24999,
      discountPercent: 10,
    },
    {
      _id: "6",
      productName: "Professional Camera Lens",
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"],
      price: 24999,
      discountPercent: 10,
    },
  ];

  const isLoading = false;
  const isError = false;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          {/* Header Section */}
          <div className="">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Recent <span className="text-green-600">Products</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-green-400 rounded-md"></div>
          </div>

          {/* View All Button */}
          {approvedProducts?.length > 0 && (
            <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-10 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              View All Products →
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-md h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
            <p className="ml-4 text-gray-600 text-lg">Loading products...</p>
          </div>
        ) : isError ? (
          <div className="max-w-2xl mx-auto text-center p-8 border-2 border-red-200 bg-red-50 text-red-700 rounded-md shadow-lg mb-10">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-3">Failed to load products</h2>
            <p className="text-lg">Please try again later or contact support if the problem persists.</p>
          </div>
        ) : approvedProducts?.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center p-8 border-2 border-yellow-200 bg-yellow-50 text-yellow-700 rounded-md shadow-lg mb-10">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-3">No approved products found</h2>
            <p className="text-lg">New products will appear here once they are available and approved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {approvedProducts?.map((item) => {
              const discountedPrice = (
                item.price -
                (item.discountPercent / 100) * item.price
              ).toFixed(2);

              return (
                <div
                  key={item._id}
                  className="group relative bg-white rounded-md overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  {/* Discount Badge */}
                  {item?.discountPercent > 0 && (
                    <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg animate-pulse">
                      -{item.discountPercent}%
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white p-2 rounded-md shadow-lg hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="bg-white p-2 rounded-md shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
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

                    {/* View Details Button */}
                    <div className="flex flex-col self-end">
                      <Link href={`/client/product/${item._id}`} className="w-full">
                        <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                          <Eye className="w-4 h-4 group-hover:scale-110" />
                          <span>View Details</span>
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
        )}
      </div>
    </div>
  );
}