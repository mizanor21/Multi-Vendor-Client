"use client";
import {
  useGetAllOrdersOfAnStallOwnerQuery,
  useUpdateAnOrderMutation,
} from "@/app/api/shippingSlice";
import DeleteIcon from "@/public/DeleteIcon";
import StarIcon from "@/public/StarIcon";
import TkIcon from "@/public/TkIcon";
import Loader from "@/utils/loader/Loader";
import { Button, Chip } from "@heroui/react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SellerOrders() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const stallOwnerEmail = Cookies?.get("stallInfo");
    // console.log("stallOwnerEmail", stallOwnerEmail);
    if (stallOwnerEmail) {
      const parsedStallInfo = JSON.parse(stallOwnerEmail);
      setEmail(parsedStallInfo?.stall?.stallOwnerEmail);
    }
  }, []);

  const { data: stallAllOrders, isLoading: stallOrdersLoader } =
    useGetAllOrdersOfAnStallOwnerQuery(email);

  console.log("stallAllOrders", stallAllOrders);

  const [updateAnOrder, { isLoading: orderCompleteLoader }] =
    useUpdateAnOrderMutation();

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  // Calculate shipping cost based on city
  const calculateShippingCost = (city, shippingFees) => {
    if (!shippingFees) return 0;

    // Normalize city name for comparison
    const normalizedCity = city?.toLowerCase()?.trim();

    // Apply insideCity rate for Dhaka, outsideCity for others
    return normalizedCity === "dhaka"
      ? shippingFees.insideCity
      : shippingFees.outsideCity;
  };

  const handleCompleteOrder = async (orderId) => {
    const orderData = {
      status: "completed",
    };
    try {
      const res = await updateAnOrder({ orderData, orderId })?.unwrap();

      if (res?.message) {
        Swal?.fire({
          title: res?.message,
          icon: "success",
          confirmButtonAriaLabel: "OK",
        });
      } else {
        Swal?.fire({
          title: "Order can not be completed. Try again later.",
          icon: "error",
          confirmButtonArialLabel: "OK",
        });
      }
    } catch (error) {
      Swal?.fire({
        title: "Failed to complete order. Please try again.",
        icon: "error",
        confirmButtonAriaLabel: "OK",
      });
    }
  };

  const handleCancelOrder = async (orderId) => {
    const orderData = {
      status: "cancelled",
    };
    try {
      const res = await updateAnOrder({ orderData, orderId })?.unwrap();

      if (res?.message) {
        Swal?.fire({
          title: "Order cancelled successfully.",
          icon: "success",
          confirmButtonAriaLabel: "OK",
        });
      } else {
        Swal?.fire({
          title: "Order can not be cancelled. Try again later.",
          icon: "error",
          confirmButtonArialLabel: "OK",
        });
      }
    } catch (error) {
      Swal?.fire({
        title: "Failed to cancel order. Please try again.",
        icon: "error",
        confirmButtonAriaLabel: "OK",
      });
    }
  };

  if (!email || stallOrdersLoader) {
    return <Loader />;
  }

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-md bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-md bg-clip-border">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-semibold text-slate-800">My Orders</h3>
            <p className="text-sm text-slate-500">
              {stallAllOrders?.length || 0} orders found
            </p>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Product
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Buyer
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Shipping
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Price
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Qty
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Discount
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Shipping Cost
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Total
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Status
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Order Date
                </th>
                <th className="p-4 border-y border-slate-200 bg-slate-50">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {[...stallAllOrders]?.reverse()?.map((order) => {
                const product = order.productDetails?.productId;
                const user = order.userDetails;
                const shipping = order.shippingDetails;

                if (!product || !user || !shipping) return null;

                // Calculate prices
                const discountAmount =
                  (product.price * product.discountPercent) / 100;
                const discountedPrice = product.price - discountAmount;
                const shippingCost = calculateShippingCost(
                  shipping.city,
                  product.shippingFees
                );
                const subtotal = discountedPrice * order.quantity;
                const total = subtotal + shippingCost;
                const avgRating = calculateAverageRating(
                  product.ratingsAndReviews
                );

                return (
                  <tr key={order._id}>
                    {/* Product */}
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.productName}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">
                            {product.productName}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {product.productId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Buyer */}
                    <td className="p-4 border-b border-slate-200">
                      <div>
                        <p className="font-medium">{user.userName}</p>
                        <p className="text-sm text-slate-500">
                          {user.phoneNumber}
                        </p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </td>

                    {/* Shipping */}
                    <td className="p-4 border-b border-slate-200">
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {shipping.city}
                        </p>
                        <p className="text-xs text-slate-500">
                          {shipping.nearArea}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[120px]">
                          {shipping.address}
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-slate-500 line-through text-sm">
                          <TkIcon size="14px" color="black" />
                          {product.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1 font-semibold">
                          <TkIcon size="16px" color="black" />
                          {discountedPrice.toFixed(2)}
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="p-4 border-b border-slate-200">
                      <div className="font-medium text-center">
                        {order.quantity}
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="p-4 border-b border-slate-200">
                      <div className="text-red-500 font-medium">
                        {product.discountPercent}%
                      </div>
                    </td>

                    {/* Shipping Cost */}
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <TkIcon size="16px" color="black" />
                        {shippingCost.toFixed(2)}
                        <span className="text-xs text-slate-500 ml-1">
                          (
                          {shipping.city.toLowerCase() === "dhaka"
                            ? "Inside"
                            : "Outside"}
                          )
                        </span>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex items-center gap-1 font-semibold text-green-700">
                        <TkIcon size="16px" color="#15803d" />
                        {total.toFixed(2)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 border-b border-slate-200">
                      <Chip
                        color={getStatusColor(order?.status)}
                        className="capitalize"
                      >
                        {order?.status}
                      </Chip>
                    </td>

                    {/* Order Date */}
                    <td className="p-4 border-b border-slate-200">
                      <p className="text-sm">{formatDate(order.createdAt)}</p>
                    </td>

                    {/* Actions */}
                    <td className="p-4 border-b border-slate-200">
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          color="success"
                          isLoading={orderCompleteLoader}
                          size="sm"
                          onPress={() => handleCompleteOrder(order?._id)}
                        >
                          ✓
                        </Button>
                        <Button isIconOnly color="danger" size="sm">
                          <DeleteIcon size="18px" color="#ffffff" />
                        </Button>
                        <Button
                          onPress={() => handleCancelOrder(order?._id)}
                          isIconOnly
                          isLoading={orderCompleteLoader}
                          color="warning"
                          size="sm"
                        >
                          x
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3">
          <p className="block text-sm text-slate-500">Page 1 of 10</p>
          <div className="flex gap-1">
            <button className="rounded-md border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75">
              Previous
            </button>
            <button className="rounded-md border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
