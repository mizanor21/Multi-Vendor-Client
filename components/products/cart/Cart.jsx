"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Image } from "@heroui/image";
import { NumberInput } from "@heroui/react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Divider } from "@heroui/divider";

import { useRouter } from "next/navigation";
import {
  useCartItemDeleteMutation,
  useGetCartProductsQuery,
  useUpdateCartInfoMutation,
} from "@/app/api/cartApiSlice";

import DeleteIcon from "@/public/DeleteIcon";
import TkIcon from "@/public/TkIcon";
import Swal from "sweetalert2";

export default function Cart() {
  const router = useRouter();
  const { data: cartData } = useGetCartProductsQuery();
  const [cartItemDelete, { isLoading: deleteLoader }] =
    useCartItemDeleteMutation();
  const [UpdateCartInfo, { isLoading: updateLoader }] =
    useUpdateCartInfoMutation();

  const cartItems = cartData || [];

  const [quantities, setQuantities] = useState(() => {
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item._id] = item.quantity;
    });
    return initialQuantities;
  });

  const handleQuantityChange = async (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));

    const cartData = {
      cartId: id,
      quantity: value,
    };

    const res = await UpdateCartInfo(cartData);

    if (!res?.data) {
      Swal.fire({
        title: res?.error?.data?.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  const handleDeleteCartItem = async (productId) => {
    try {
      const res = await cartItemDelete(productId);
    } catch (error) {
      Swal.fire({
        title: error?.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price =
        item.productId.price -
        (item.productId.discountPercent / 100) * item.productId.price;
      return total + price * quantities[item._id];
    }, 0);
  };

  const handleCheckout = () => {
    router.push(`/client/shippingAddress`);
  };

  return (
    <div className="container mx-auto px-4 md:px-8">
      <p className="mt-16 mb-6 text-center text-3xl font-semibold text-gray-800">
        My Cart
      </p>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Your cart is empty</p>
          <Button
            className="mt-4"
            color="primary"
            onPress={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-auto rounded-md bg-white">
            <Table
              isStriped
              aria-label="Shopping Cart Table"
              className="min-w-full m-4"
            >
              <TableHeader>
                <TableColumn className="text-left">Image</TableColumn>
                <TableColumn className="text-left">Name</TableColumn>
                <TableColumn className="text-left">Seller</TableColumn>
                <TableColumn className="text-center">Quantity</TableColumn>
                <TableColumn className="text-center">Condition</TableColumn>
                <TableColumn className="text-right">Price</TableColumn>
                <TableColumn className="text-center">Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => {
                  const product = item.productId;
                  const discountedPrice =
                    product.price -
                    (product.discountPercent / 100) * product.price;
                  return (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Image
                          alt={product.images[0]}
                          src={product.images[0]}
                          width={100}
                          className="rounded-md"
                        />
                      </TableCell>
                      <TableCell>
                        <p className="text-base font-medium text-gray-700">
                          {product.productName}
                        </p>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-base font-medium text-gray-700">
                          {item?.stallInfo?.stallOwnerName || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item?.stallInfo?.stallLocation}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <NumberInput
                          className="max-w-[100px] mx-auto"
                          value={quantities[item._id]}
                          min={1}
                          max={product?.stockQuantity}
                          variant="bordered"
                          isLoading={updateLoader}
                          size="sm"
                          onChange={(val) =>
                            handleQuantityChange(item._id, Number(val))
                          }
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {/* {product.stockQuantity} available */}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        {product.productCondition}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center text-gray-700 font-medium">
                          <TkIcon size="16px" color="black" />
                          {discountedPrice.toFixed(2)}
                        </div>
                        {product.discountPercent > 0 && (
                          <div className="flex justify-end items-center text-gray-700 font-medium line-through">
                            <TkIcon size="16px" color="black" />
                            {product.price.toFixed(2)}
                          </div>
                        )}
                        <div className="flex justify-end items-center text-green-600 text-sm mt-1">
                          You save <TkIcon size="12px" color="green" />
                          {(
                            (product.discountPercent / 100) *
                            product.price
                          ).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip content="Remove this product">
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            isLoading={deleteLoader}
                            onPress={() => handleDeleteCartItem(item?._id)}
                          >
                            <DeleteIcon size="20px" color="#ffffff" />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Divider className="my-6" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <p className="text-lg font-semibold text-gray-800">Total Price:</p>
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
              <TkIcon size="22px" color="black" />
              {calculateTotalPrice().toFixed(2)}
            </div>
          </div>

          <div className="flex justify-center mb-5">
            <Button
              onPress={handleCheckout}
              color="primary"
              size="lg"
              radius="md"
              isDisabled={cartItems.length === 0}
            >
              Continue to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
