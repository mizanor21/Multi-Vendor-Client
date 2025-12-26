"use client";
import React from "react";
import { Heart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock TkIcon component (use your actual TkIcon if available)
const TkIcon = ({ size, color, className }) => (
  <span className={className} style={{ fontSize: size, color }}>
    ৳
  </span>
);

export default function ProductCard({ product }) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercent
  );
  const savings = (product.price - discountedPrice).toFixed(2);
  const truncatedName = truncateProductName(product.productName);

  return (
    <Link href={`/client/product/${product._id}`}>
      <div className="group relative h-full flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/80 cursor-pointer">

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
        <div className="px-4 pt-4 flex-1">
          <ProductName name={truncatedName} />
          <PriceSection
            price={product.price}
            discountedPrice={discountedPrice}
            discountPercent={product.discountPercent}
            savings={savings}
          />
        </div>

        {/* View Details Button - Fixed at Bottom */}
        <div className="px-4 py-4 mt-auto">
          <div className="w-full flex items-center justify-center py-2 bg-gradient-to-r from-emerald-400 to-indigo-500 text-sm text-white rounded shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
            View Details
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </Link>
  );
}

// Sub-components
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

function PriceSection({ price, discountedPrice, discountPercent, savings }) {
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