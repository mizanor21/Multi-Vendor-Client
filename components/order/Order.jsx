"use client";
import { useGetAllOrdersOfAnUserQuery } from "@/app/api/orderSlice";
import Loader from "@/utils/loader/Loader";
import { Button } from "@heroui/react";
import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Order() {
  const [email, setEmail] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    const cookieEmail = Cookies.get("loginInfo");
    if (cookieEmail) setEmail(cookieEmail);
  }, []);

  const { data: getAllOrdersOfAnUser, isLoading: orderLoader } =
    useGetAllOrdersOfAnUserQuery(email, {
      skip: !email,
    });

  if (!isHydrated) {
    return null;
  }

  if (orderLoader) {
    return <Loader />;
  }

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-xl text-gray-600">
          Please log in to view your orders.
        </p>
        <Button
          color="success"
          className="mt-5"
          onPress={() => router.push("/")}
        >
          Go to Home
        </Button>
      </div>
    );
  }

  const orders = getAllOrdersOfAnUser || [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-xl text-gray-600">You have no orders yet.</p>
        <Button
          color="success"
          className="mt-5"
          onPress={() => router.push("/")}
        >
          Want to make an order?
        </Button>
      </div>
    );
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          My Orders
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-6">
        {sortedOrders.map((order) => {
          const product = order?.productDetails?.productId;
          const user = order?.userDetails;
          const shipping = order?.shippingDetails;

          // Calculate pricing
          const discountAmount = product?.discountPercent
            ? (product?.price * product?.discountPercent) / 100
            : 0;
          const discountedPrice = product?.price - discountAmount;
          const shippingCost =
            shipping?.city?.toLowerCase() === "dhaka"
              ? product?.shippingFees?.insideCity || 0
              : product?.shippingFees?.outsideCity || 0;
          const total = discountedPrice * order?.quantity + shippingCost;

          return (
            <div
              key={order._id}
              className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order # {order?._id?.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${
                          order?.status === "completed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : order?.status === "cancelled"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {order?.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on{" "}
                      {moment(order?.createdAt).format("MMMM Do YYYY, h:mm A")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ৳{total?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order?.quantity} item{order?.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image and Basic Info */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:w-2/3">
                    <div className="flex-shrink-0">
                      <img
                        src={product?.images?.[0] || "/no-image.png"}
                        alt={product?.productName || "Product image"}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          e.target.src = "/no-image.png";
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {product?.productName || "Product Name Not Available"}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Brand:</span>{" "}
                          {product?.brand || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Condition:</span>
                          <span className="capitalize">
                            {" "}
                            {product?.productCondition || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>{" "}
                          {order?.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Product ID:</span>{" "}
                          {product?.productId || "N/A"}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Unit Price:</span>
                          <span>৳{product?.price?.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm mb-1 text-green-600">
                            <span>Discount ({product?.discountPercent}%):</span>
                            <span>-৳{discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm mb-1">
                          <span>Shipping:</span>
                          <span>৳{shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                          <span>Total:</span>
                          <span>৳{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping and User Details */}
                  <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                    <div className="space-y-4">
                      {/* Shipping Information */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>🚚 Shipping Details</span>
                        </h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Address:</span>{" "}
                            {shipping?.address}
                          </p>
                          <p>
                            <span className="font-medium">City:</span>{" "}
                            {shipping?.city}
                          </p>
                          <p>
                            <span className="font-medium">Area:</span>{" "}
                            {shipping?.nearArea || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {shipping?.phoneNumber}
                          </p>
                        </div>
                      </div>

                      {/* User Information */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>👤 Ordered By</span>
                        </h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {user?.userName}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {user?.email}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {user?.phoneNumber}
                          </p>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="pt-2">
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          className="w-full"
                          onPress={() => {
                            // Add order tracking or details view functionality
                            console.log("View order details:", order._id);
                          }}
                        >
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Last Updated:</span>
                    <span>
                      {moment(order?.updatedAt).format("MMMM Do YYYY, h:mm A")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono">{order?._id}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 text-center text-gray-600">
        <p>
          Showing {sortedOrders.length} order
          {sortedOrders.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
