import React, { useState, useEffect } from "react";

export default function ProductCard({ item }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate discounted price
  const discountedPrice =
    item.discountPercent > 0
      ? item.price - (item.discountPercent / 100) * item.price
      : item.price;

  // Format price with commas
  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate average rating and review count
  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    return {
      average: average,
      count: reviews.length,
    };
  };

  const { average: averageRating, count: reviewCount } = calculateRating(
    item.ratingsAndReviews
  );
  const roundedAverage = Math.round(averageRating);

  // Determine stock status styling
  const getStockStatus = () => {
    if (item.stockStatus === "in-stock") {
      return (
        <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
          In Stock
        </span>
      );
    }
    if (item.stockStatus === "low-stock") {
      return (
        <span className="text-amber-600 bg-amber-100 px-2 py-1 rounded text-xs">
          Low Stock
        </span>
      );
    }
    return (
      <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs">
        Out of Stock
      </span>
    );
  };

  return (
    <div
      key={item._id}
      className="relative group overflow-hidden transition-all duration-300 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Ribbon - Modern Design */}
      {item.discountPercent > 0 && (
        <div className="absolute top-4 right-0 z-20">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xs px-4 py-1.5 rounded-l-md shadow-lg transform transition-transform duration-300 group-hover:scale-105">
            <span className="drop-shadow-md">SAVE {item.discountPercent}%</span>
          </div>
        </div>
      )}

      <a href={`/client/product/${item._id}`}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col cursor-pointer">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <div className="relative h-60 w-full">
              <img
                alt={item.productName}
                src={item.images[0]}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            {/* Stock Status */}
            <div className="absolute top-3 left-3 z-10">{getStockStatus()}</div>

            {/* Quick View Button */}
            <div
              className={`absolute bottom-4 left-0 right-0 flex justify-center transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <button className="bg-white text-indigo-600 font-medium py-2 px-6 rounded-full shadow-md hover:bg-indigo-50 transition-colors">
                Quick View
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Brand */}
            <div className="text-xs text-indigo-600 font-medium mb-1">
              {item.brand || "Premium Brand"}
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12 hover:text-indigo-600 transition-colors">
              {item.productName}
            </h3>

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        index < roundedAverage
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({reviewCount})
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-2">
                {item.discountPercent > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ৳{formatPrice(item.price)}
                  </span>
                )}
                <span className="text-xl font-bold text-gray-900">
                  ৳{formatPrice(discountedPrice)}
                </span>
              </div>

              {/* Shipping Info */}
              <div className="mt-1 text-xs text-gray-500">
                {item.shippingType === "free" ? (
                  <span className="text-green-600">Free Shipping</span>
                ) : (
                  <span>
                    Shipping: ৳{item.shippingFees?.insideCity || 0} inside city
                  </span>
                )}
              </div>

              {/* Add to Cart Button - Appears on hover */}
              {/* <button
                className={`mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-medium transition-all duration-300 transform ${
                  isHovered
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                } ${
                  item.stockStatus !== "in-stock"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={item.stockStatus !== "in-stock"}
              >
                {item.stockStatus === "in-stock"
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button> */}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
