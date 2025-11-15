import React from "react";

export default function CategoryProductsLoading() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-16">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div className="h-1 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-12 w-40 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {[...Array(6)].map((_, j) => (
                <ProductCardSkeleton key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative pt-[100%] bg-gray-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}