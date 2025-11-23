"use client";
import React from "react";
import { Heart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetAllProductsQuery } from "@/app/api/productSlice";

// Mock TkIcon component (use your actual TkIcon if available)
const TkIcon = ({ size, color, className }) => (
  <span className={className} style={{ fontSize: size, color }}>৳</span>
);

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
    <div className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Recent <span className="text-green-600">Products</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-green-400 rounded-md"></div>
          </div>

          {/* View All Button */}
          {approvedProducts?.length > 0 && (
            <Link href="/products">
              <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-10 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                View All Products →
              </button>
            </Link>
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
            {approvedProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Product Card Component (same as in CategoryProductsClient)
function ProductCard({ product }) {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercent);
  const savings = (product.price - discountedPrice).toFixed(2);
  const truncatedName = truncateProductName(product.productName);

  return (
    <Link href={`/client/product/${product._id}`}>
      <div className="group relative bg-white rounded-md overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-gray-100 cursor-pointer">
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <DiscountBadge discount={product.discountPercent} />
        )}

        {/* Quick Action Buttons */}
        <div>
          <QuickActionButtons />
        </div>

        {/* Product Image */}
        <ProductImage image={product.images[0]} name={product.productName} />

        {/* Product Info */}
        <div className="px-3 pt-3">
          <ProductName name={truncatedName} />
          <PriceSection
            price={product.price}
            discountedPrice={discountedPrice}
            discountPercent={product.discountPercent}
            savings={savings}
          />
        </div>

        {/* View Details Button - Full Width at Bottom */}
        <div className="px-3 pb-3">
          <div className="w-full text-center py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md shadow-md">
            View Details
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </Link>
  );
}

// Reuse all the same sub-components from CategoryProductsClient
function DiscountBadge({ discount }) {
  return (
    <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg animate-pulse">
      -{discount}%
    </div>
  );
}

function QuickActionButtons() {
  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button
        className="bg-white p-2 rounded-md shadow-lg hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-110"
        aria-label="Add to wishlist"
      >
        <Heart className="w-4 h-4" />
      </button>
      <button
        className="bg-white p-2 rounded-md shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
        aria-label="Quick view"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );
}

function ProductImage({ image, name }) {
  return (
    <div className="relative overflow-hidden bg-gray-100">
      <div className="relative pt-[100%]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>
    </div>
  );
}

function ProductName({ name }) {
  return (
    <h3 className="text-gray-800 font-semibold text-sm md:text-base line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
      {name}
    </h3>
  );
}

function PriceSection({
  price,
  discountedPrice,
  discountPercent,
  savings
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-green-600 font-bold text-lg md:text-xl flex items-center">
          <TkIcon size="18px" color="#16a34a" className="mr-1" />
          {discountedPrice}
        </span>
      </div>
      {discountPercent > 0 && (
        <div className="flex items-center">
          <span className="text-gray-400 text-xs md:text-sm line-through flex items-center">
            <TkIcon size="12px" color="#9ca3af" className="mr-0.5" />
            {price}
          </span>
          <span className="ml-2 text-xs text-green-600 font-medium">
            Save ৳{savings}
          </span>
        </div>
      )}
    </div>
  );
}

// Utility Functions
function calculateDiscountedPrice(price, discountPercent) {
  return parseFloat((price - (discountPercent / 100) * price).toFixed(2));
}

function truncateProductName(name) {
  const words = name.split(" ");
  return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : name;
}