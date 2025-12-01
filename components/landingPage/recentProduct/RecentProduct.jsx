import React, { Suspense } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

// Server-side data fetching function
async function getRecentProducts() {
  try {
    const res = await fetch(
      "https://multi-vendor-backend-orpin.vercel.app/api/products",
      {
        next: { revalidate: 300 }, // Revalidate every 300 seconds (ISR)
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

// Loading skeleton component
function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-md overflow-hidden shadow-sm animate-pulse"
        >
          <div className="relative pt-[100%] bg-gray-200"></div>
          <div className="px-3 pt-3 pb-3">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Products content component
async function ProductsContent() {
  const getAllProductData = await getRecentProducts();

  const approvedProducts = getAllProductData?.products
    ?.filter((item) => item?.approvalStatus === "approved")
    ?.slice(-8)
    .reverse();

  if (!getAllProductData) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8 border-2 border-red-200 bg-red-50 text-red-700 rounded-md shadow-lg mb-10">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-3">Failed to load products</h2>
        <p className="text-lg">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }

  if (approvedProducts?.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8 border-2 border-yellow-200 bg-yellow-50 text-yellow-700 rounded-md shadow-lg mb-10">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-3">No approved products found</h2>
        <p className="text-lg">
          New products will appear here once they are available and approved.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {approvedProducts?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default async function RecentProduct() {
  // Get products data to check if we should show "View All" button
  const getAllProductData = await getRecentProducts();
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

        {/* Products with Suspense */}
        <Suspense fallback={<ProductsLoadingSkeleton />}>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}