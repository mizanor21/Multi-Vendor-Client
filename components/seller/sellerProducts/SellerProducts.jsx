"use client";
import AddIcon from "@/public/AddIcon";
import DeleteIcon from "@/public/DeleteIcon";
import EditIcon from "@/public/EditIcon";
import StarIcon from "@/public/StarIcon";
import TkIcon from "@/public/TkIcon";
import { useRouter } from "next/navigation";
import { Button, Chip, Input } from "@heroui/react";
import { Image } from "@heroui/image";
import { useDisclosure } from "@heroui/react";
import CreateProductModal from "./createProductModal/CreateProductModal";
import {
  useGetAStallByEmailQuery,
  useSellerDeleteAProductMutation,
} from "@/app/api/stallSlice";

import Cookies from "js-cookie";
import { useGetASellerAllProductQuery } from "@/app/api/productSlice";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Loader from "@/utils/loader/Loader";
import moment from "moment";
import SearchIcon from "@/public/SearchIcon"; // You might need to create this icon
import Link from "next/link";

export default function SellerProducts() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cookie = Cookies.get("stallInfo");
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        setEmail(parsed?.stall?.stallOwnerEmail);
      } catch (err) {
        console.error("Invalid JSON in stallInfo cookie", err);
      }
    }
  }, []);

  const { data: getStallDataByEmail } = useGetAStallByEmailQuery(email);
  const { data: getASellerAllProduct, isLoading } =
    useGetASellerAllProductQuery(email);
  const { data: getAllCategories } = useGetAllCategoriesQuery();
  const [sellerDeleteAProduct, { isLoading: deleteProductLoader }] =
    useSellerDeleteAProductMutation();

  // Filter products based on search term
  const filteredProducts =
    getASellerAllProduct?.products
      ?.slice()
      ?.reverse()
      ?.filter((product) =>
        product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the items to display on current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDeleteAProduct = async (productId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await sellerDeleteAProduct({ productId, email });

        if (res) {
          Swal.fire({
            title: "Deleted!",
            text: "Your product has been deleted.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Product could not be deleted.",
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error?.message || "Something went wrong.",
          icon: "error",
        });
      }
    }
  };

  const handleProductUpdate = (productId) => {
    router.push(`/seller/products/update?productId=${productId}`);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="max-w-full mx-auto">
        <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
          <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-3xl font-semibold text-slate-800">
                  My Products
                </h3>
                {totalItems > 0 && (
                  <p className="text-sm text-slate-600 mt-1">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                    {totalItems} products
                    {searchTerm && (
                      <span>
                        {" "}
                        for "<strong>{searchTerm}</strong>"
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Search Field */}
              <div className="w-full lg:w-80">
                <Input
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  startContent={
                    <SearchIcon size="20px" color="#64748b" /> // You can use any search icon
                  }
                  endContent={
                    searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        ✕
                      </button>
                    )
                  }
                  className="w-full"
                />
              </div>

              <div>
                {getStallDataByEmail?.map((stall) =>
                  stall?.stallStatus === "approved" ? (
                    <Link href="/seller/products/add" key={stall?._id}>
                      <Button
                        key={stall?._id}
                        // onPress={onOpen}
                        startContent={<AddIcon size="24px" color="#ffffff" />}
                        color="primary"
                      >
                        Add a product
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/seller/products/add" key={stall?._id}>
                      <Button
                        key={stall?._id}
                        // onPress={onOpen}
                        startContent={<AddIcon size="24px" color="#ffffff" />}
                        color="primary"
                      >
                        Add a product
                      </Button>
                    </Link>
                  )
                )}

                <CreateProductModal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                />
              </div>
            </div>
          </div>
          <div className="p-0 overflow-scroll">
            <table className="w-full mt-4 text-left table-auto min-w-max overflow-y-scroll">
              <thead>
                <tr>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                      Product
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                      Seller/Stall name
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Category
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Stock Status
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Price
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Quantity
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Total Orders
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Discount/Offer
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Status
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Rating
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Added Date
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Actions
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-scroll">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product?._id}>
                      <td className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <Image
                            alt={product?.images[0]}
                            src={product?.images[0]}
                            width={100}
                          />
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-700">
                              {product?.productName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <div className="flex flex-col">
                          {getStallDataByEmail?.map((stall) => (
                            <p
                              key={stall?._id}
                              className="text-sm font-semibold text-slate-700"
                            >
                              {stall?.stallOwnerName}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <div className="w-max">
                          {getAllCategories?.find(
                            (category) => category?._id === product?.category
                          ) && (
                            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                              <span>
                                {
                                  getAllCategories.find(
                                    (category) =>
                                      category._id === product?.category
                                  )?.name
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="text-sm text-slate-500">
                          {product?.stockStatus}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <div className="text-sm text-slate-500 flex flex-row items-center">
                          <TkIcon size="20px" color="#314158" />
                          {product?.price}
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <div className="text-sm text-slate-500 flex flex-row items-center">
                          {product?.stockQuantity}
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <div className="text-sm text-slate-500 flex flex-row items-center">
                          {product?.totalOrders}
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="text-sm text-slate-500 flex flex-row items-center">
                          {product?.discountPercent}%
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        {product?.approvalStatus === "pending" && (
                          <Chip color="warning" variant="bordered">
                            Pending
                          </Chip>
                        )}
                        {product?.approvalStatus === "approved" && (
                          <Chip color="success" variant="bordered">
                            Approved
                          </Chip>
                        )}
                        {product?.approvalStatus === "reviewing" && (
                          <Chip color="secondary" variant="bordered">
                            Reviewing
                          </Chip>
                        )}
                      </td>
                      <td className="p-4 border-b border-slate-200 ">
                        <div className="flex flex-row items-center">
                          {product?.ratingsAndReviews?.length}
                          <StarIcon size="20px" color="#314158" />
                        </div>
                        <p className="text-sm text-slate-500">
                          {product?.ratingsAndReviews?.length} users reviewed
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="flex flex-row items-center">
                          {moment(product?.createdAt).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <Button
                          onClick={() => handleDeleteAProduct(product?._id)}
                          isIconOnly
                          color="danger"
                          isLoading={deleteProductLoader}
                        >
                          <DeleteIcon size="24px" color="#ffffff" />
                        </Button>
                        <Button
                          onPress={() => handleProductUpdate(product?._id)}
                          isIconOnly
                          color="success"
                          className="ms-3"
                        >
                          <EditIcon size="24px" color="#ffffff" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="13"
                      className="p-8 text-center border-b border-slate-200"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg text-slate-500 mb-2">
                          {searchTerm
                            ? "No products found"
                            : "No products available"}
                        </p>
                        {searchTerm && (
                          <p className="text-sm text-slate-400">
                            No products found for "<strong>{searchTerm}</strong>
                            "
                          </p>
                        )}
                        {searchTerm && (
                          <Button
                            onClick={handleClearSearch}
                            color="primary"
                            variant="flat"
                            className="mt-2"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3">
              <p className="block text-sm text-slate-500">
                Page {currentPage} of {totalPages}
                {totalItems > 0 && (
                  <span>
                    {" "}
                    ({totalItems} total items{searchTerm && " found"})
                  </span>
                )}
              </p>
              <div className="flex gap-1 items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof pageNumber === "number"
                        ? handlePageClick(pageNumber)
                        : null
                    }
                    className={`rounded border py-2.5 px-3 text-center text-xs font-semibold transition-all ${
                      pageNumber === currentPage
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-slate-300 text-slate-600 hover:opacity-75"
                    } ${
                      typeof pageNumber !== "number"
                        ? "pointer-events-none"
                        : "cursor-pointer"
                    }`}
                    disabled={typeof pageNumber !== "number"}
                    type="button"
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
