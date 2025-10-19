"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { useGetASingleUserQuery } from "@/app/api/authSlice";
import { useCreateAnOrderMutation } from "@/app/api/shippingSlice";
import { Button } from "@heroui/react";
import Swal from "sweetalert2";
import {
  useClearCartMutation,
  useGetCartProductsQuery,
} from "@/app/api/cartApiSlice";

import { useRouter } from "next/navigation";

export default function ShippingAddress() {
  const router = useRouter();

  const email = Cookies?.get("loginInfo");
  const { data: userInfo } = useGetASingleUserQuery(email);
  const { data: cartProducts } = useGetCartProductsQuery();
  const [createAnOrder, { isLoading: orderCreateLoader }] =
    useCreateAnOrderMutation();
  const [clearCart] = useClearCartMutation();

  // Form state
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [nearArea, setNearArea] = useState("");

  // Calculate total price
  const calculateTotal = () => {
    return (
      cartProducts?.reduce((total, item) => {
        const priceAfterDiscount =
          item.productId.price * (1 - item.productId.discountPercent / 100);
        return total + priceAfterDiscount * item.quantity;
      }, 0) || 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartProducts || cartProducts.length === 0) {
      Swal.fire({
        title: "Your cart is empty!",
        text: "Please add products to your cart before placing an order.",
        icon: "warning",
      });
      return;
    }

    const orderData = {
      shippingDetails: {
        phoneNumber: userInfo?.phoneNumber,
        address,
        city,
        nearArea,
      },
      userDetails: {
        userName: userInfo?.userName,
        email: userInfo?.email,
        phoneNumber: userInfo?.phoneNumber,
      },
      products: cartProducts.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price:
          item.productId.price * (1 - item.productId.discountPercent / 100),
      })),
      status: "pending",
      totalAmount: calculateTotal(),
    };

    console.log("orderData", orderData);

    try {
      const res = await createAnOrder(orderData);
      if (res?.data) {
        // ✅ Clear the cart
        await clearCart();
        Swal.fire({
          title: "Order placed successfully!",
          icon: "success",
          draggable: true,
        });
        router.push("/");
      } else {
        Swal.fire({
          title: "Failed to place order!",
          icon: "error",
          draggable: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message || "Something went wrong",
        icon: "error",
        draggable: true,
      });
    } finally {
      setPhoneNumber("");
      setAddress("");
      setCity("");
      setNearArea("");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!cartProducts || cartProducts.length === 0) {
  //     Swal.fire({
  //       title: "Your cart is empty!",
  //       text: "Please add products to your cart before placing an order.",
  //       icon: "warning",
  //     });
  //     return;
  //   }

  //   const orderData = {
  //     shippingDetails: {
  //       phoneNumber,
  //       address,
  //       city,
  //       nearArea,
  //     },
  //     userDetails: {
  //       userName: userInfo?.userName,
  //       email: userInfo?.email,
  //       phoneNumber: userInfo?.phoneNumber,
  //     },
  //     status: "pending",
  //   };

  //   try {
  //     const res = await createAnOrder(orderData);
  //     if (res?.data) {
  //       await clearCart();
  //       Swal.fire({
  //         title: "Order placed successfully!",
  //         icon: "success",
  //         draggable: true,
  //       });
  //     } else {
  //       Swal.fire({
  //         title: "Failed to place order!",
  //         icon: "error",
  //         draggable: true,
  //       });
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: error?.message || "Something went wrong",
  //       icon: "error",
  //       draggable: true,
  //     });
  //   } finally {
  //     setPhoneNumber("");
  //     setAddress("");
  //     setCity("");
  //     setNearArea("");
  //   }
  // };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Shipping Information */}
        <div className="md:w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Shipping Information
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userInfo?.userName || ""}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo?.email || ""}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={userInfo?.phoneNumber || ""}
                readOnly
                className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select your city
                  </option>
                  <option value="dhaka">Dhaka</option>
                  <option value="chittagong">Chittagong</option>
                  <option value="rajshahi">Rajshahi</option>
                  <option value="khulna">Khulna</option>
                  <option value="sylhet">Sylhet</option>
                  <option value="barisal">Barisal</option>
                  <option value="rangpur">Rangpur</option>
                  <option value="mymensingh">Mymensingh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Near Area / Locality
                </label>
                <select
                  value={nearArea}
                  onChange={(e) => setNearArea(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select nearby area
                  </option>
                  <option value="uttara">Uttara</option>
                  <option value="banani">Banani</option>
                  <option value="mirpur">Mirpur</option>
                  <option value="dhanmondi">Dhanmondi</option>
                  <option value="gulshan">Gulshan</option>
                  <option value="cumilla">Cumilla</option>
                  <option value="chandpur">Chandpur</option>
                  <option value="feni">Feni</option>
                  <option value="noakhali">Noakhali</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address
              </label>
              <textarea
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Road #, Area"
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cartProducts?.map((item) => {
              const discountedPrice =
                item.productId.price *
                (1 - item.productId.discountPercent / 100);
              return (
                <div
                  key={item._id}
                  className="flex items-start gap-4 border-b pb-4"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {item.productId.productName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.productId.brand}
                    </p>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600">
                        Qty: {item.quantity}
                      </span>
                      <div className="text-right">
                        {item.productId.discountPercent > 0 && (
                          <span className="text-sm text-gray-500 line-through mr-2">
                            ৳{item.productId.price.toLocaleString()}
                          </span>
                        )}
                        <span className="font-medium text-gray-800">
                          ৳{discountedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ৳{calculateTotal().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">৳0</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-3">
              <span>Total</span>
              <span>৳{calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          <Button
            isLoading={orderCreateLoader}
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
