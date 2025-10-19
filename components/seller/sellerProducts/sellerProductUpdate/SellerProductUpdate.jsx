"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  useGetASingleProductQuery,
  useProductInfoUpdateMutation,
} from "@/app/api/productSlice";
import { useSearchParams } from "next/navigation";
import { useGetAllBrandsQuery } from "@/app/api/brandSlice";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function SellerProductUpdate() {
  const searchParams = useSearchParams();
  const id = searchParams.get("productId");
  const editorRef = useRef(null);

  // Fetch product data using RTK Query
  const { data: getSingleProduct, isLoading: productLoader } =
    useGetASingleProductQuery(id);
  const { data: getAllBrands } = useGetAllBrandsQuery();
  const { data: getAllCategories } = useGetAllCategoriesQuery();
  const [productInfoUpdate, { isLoading }] = useProductInfoUpdateMutation();

  // State to hold and manage form data
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: 0,
    discountPercent: 0,
    stockQuantity: 0,
    productCondition: "new",
    stockStatus: "in-stock",
    shippingType: "free",
    brand: "",
    tags: "",
    sellTags: "",
    images: [],
    category: "",
    subCategory: "",
    microCategory: "",
  });

  // State to hold image files selected for upload
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  // Editor configuration
  const editorConfig = useMemo(
    () => ({
      height: 300,
      readonly: false,
      enableDragAndDropFileToEditor: true,
      uploader: { insertImageAsBase64URI: true },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "ul",
        "ol",
        "indent",
        "outdent",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "image",
        "table",
        "link",
        "undo",
        "redo",
      ],
      placeholder: "Provide a detailed description of your product...",
    }),
    []
  );

  // Calculate subcategories and microcategories based on selected category
  const subcategories =
    getAllCategories?.find((cat) => cat._id === selectedCategoryId)
      ?.subcategories || [];

  const microcategories =
    subcategories?.find((sub) => sub._id === selectedSubcategoryId)
      ?.microcategories || [];

  // Use useEffect to populate the form fields when product data is loaded
  useEffect(() => {
    if (getSingleProduct) {
      const product = getSingleProduct.product;
      setFormData({
        productName: product.productName || "",
        description: product.description || "",
        price: product.price || 0,
        discountPercent: product.discountPercent || 0,
        stockQuantity: product.stockQuantity || 0,
        productCondition: product.productCondition || "new",
        stockStatus: product.stockStatus || "in-stock",
        shippingType: product.shippingType || "free",
        brand: product.brand || "",
        tags: product.tags?.join(", ") || "",
        sellTags: product.sellTags?.join(", ") || "",
        images: product.images || [],
        category: product.category || "",
        subCategory: product.subCategory || "",
        microCategory: product.microCategory || "",
      });

      // Set the selected category and subcategory IDs for dropdown dependencies
      setSelectedCategoryId(product.category || "");
      setSelectedSubcategoryId(product.subCategory || "");
    }
  }, [getSingleProduct]);

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle description changes from JoditEditor
  const handleDescriptionChange = (newContent) => {
    setFormData((prevData) => ({
      ...prevData,
      description: newContent,
    }));
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId("");
    setFormData((prevData) => ({
      ...prevData,
      category: categoryId,
      subCategory: "",
      microCategory: "",
    }));
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubcategoryId(subCategoryId);
    setFormData((prevData) => ({
      ...prevData,
      subCategory: subCategoryId,
      microCategory: "",
    }));
  };

  // Handle microcategory change
  const handleMicroCategoryChange = (e) => {
    const microCategoryId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      microCategory: microCategoryId,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  // Handle image removal from the list
  const handleImageRemove = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    console.log("Product Id:", id);

    try {
      // Prepare the data for API call
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPercent: formData.discountPercent
          ? parseFloat(formData.discountPercent)
          : 0,
        stockQuantity: parseInt(formData.stockQuantity),
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        sellTags: formData.sellTags
          ? formData.sellTags.split(",").map((tag) => tag.trim())
          : [],
      };

      await productInfoUpdate({ formData: payload, id }).unwrap();
      Swal.fire({
        title: "Product updated successfully!",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        title: error?.data?.message || "Something went wrong!",
        icon: "error",
        draggable: true,
      });
    }
  };

  // Show a loading state while fetching data
  if (productLoader) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Loading product data...</p>
      </div>
    );
  }

  // Handle case where product data is not found
  if (!getSingleProduct || !getSingleProduct.product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Product not found.</p>
      </div>
    );
  }

  const product = getSingleProduct.product;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <p className="text-center font-bold text-3xl text-gray-800 mb-6">
            Update Your Product
          </p>
          <p className="text-center text-gray-600 mb-8">
            Fill in the form to update the details for{" "}
            <span className="font-semibold">{product.productName}</span>.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Product Details Section */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Product Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Evaporative Cooler"
                    value={formData.productName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Brand
                  </label>
                  <select
                    id="brand"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.brand}
                    onChange={handleChange}
                  >
                    <option value="">Select a brand</option>
                    {getAllBrands?.map((brand) => (
                      <option key={brand?._id} value={brand?.brandName}>
                        {brand?.brandName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <JoditEditor
                    ref={editorRef}
                    value={formData.description}
                    config={editorConfig}
                    onBlur={handleDescriptionChange}
                    onChange={handleDescriptionChange}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stock Section */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Pricing & Stock
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountPercent"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discountPercent"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.discountPercent}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="stockQuantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="stockStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stock Status
                  </label>
                  <select
                    id="stockStatus"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.stockStatus}
                    onChange={handleChange}
                  >
                    <option value="in-stock">In-Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="low-stock">Low Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categorization & Tags Section */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Categorization & Tags
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {getAllCategories?.map((category) => (
                      <option key={category?._id} value={category?._id}>
                        {category?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="subCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sub-Category
                  </label>
                  <select
                    id="subCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.subCategory}
                    onChange={handleSubCategoryChange}
                    disabled={!selectedCategoryId}
                  >
                    <option value="">Select a sub-category</option>
                    {subcategories?.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="microCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Micro Category
                  </label>
                  <select
                    id="microCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.microCategory}
                    onChange={handleMicroCategoryChange}
                    disabled={!selectedSubcategoryId}
                  >
                    <option value="">Select a micro-category</option>
                    {microcategories?.map((micro) => (
                      <option key={micro._id} value={micro._id}>
                        {micro.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Search Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Rfl, Cooler, Evaporative"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Shipping & Condition Section */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Shipping & Product Condition
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="shippingType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Shipping Type
                  </label>
                  <select
                    id="shippingType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.shippingType}
                    onChange={handleChange}
                  >
                    <option value="free">Free Shipping</option>
                    <option value="Charge applicable">Paid Shipping</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="productCondition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Condition
                  </label>
                  <select
                    id="productCondition"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.productCondition}
                    onChange={handleChange}
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sellTags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Call to Action Tags
                  </label>
                  <input
                    type="text"
                    id="sellTags"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Buy Now, Call Seller"
                    value={formData.sellTags}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Product Images
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Existing Images */}
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {/* Image upload button */}
                <div className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition">
                  <input
                    type="file"
                    id="imageUpload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="text-2xl mb-1">+</span>
                  <span>Upload Image</span>
                </div>
                {/* Displaying newly selected images (optional preview) */}
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New Image Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
