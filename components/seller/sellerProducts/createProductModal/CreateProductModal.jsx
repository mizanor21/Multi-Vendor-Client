"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";

import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useUploadAProductBySellerMutation } from "@/app/api/stallSlice";
import Swal from "sweetalert2";
import { useGetAllBrandsQuery } from "@/app/api/brandSlice";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
];

export const productTags = [
  { key: "Buy Now", label: "Buy Now" },
  { key: "Call Seller", label: "Call Seller" },
  { key: "Call Whatsapp", label: "Call Whatsapp" },
];

export const stock = [
  { key: "in-stock", label: "in-stock" },
  { key: "out-of-stock", label: "out-of-stock" },
  { key: "low-stock", label: "low-stock" },
];

export const shipping = [
  { key: "free", label: "Free" },
  { key: "Charge applicable", label: "Charge applicable" },
];

export const productCondition = [
  { key: "new", label: "New" },
  { key: "used", label: "Used" },
  { key: "refurbished", label: "Refurbished" },
];

export default function CreateProductModal({ isOpen, onOpenChange }) {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const editorRef = useRef(null);

  // Generate a random 5-digit product ID
  const generateProductId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const [formData, setFormData] = useState(() => {
    const stallInfo = Cookies.get("stallInfo");
    var email = "";

    if (stallInfo) {
      try {
        const parsed = JSON.parse(stallInfo);
        email = parsed?.stall?.stallOwnerEmail || "";
      } catch (err) {
        // console.error("Invalid JSON in stallInfo cookie", err);
      }
    }

    return {
      images: [],
      productName: "",
      productId: generateProductId(), // Generate initial ID
      category: "",
      subCategory: "",
      microCategory: "",
      description: "",
      seller: "seller",
      price: "",
      discountPercent: "",
      stockQuantity: "",
      stockStatus: "in-stock",
      shippingType: "free",
      shippingFees: { insideCity: 0, outsideCity: 0 },
      productCondition: "new",
      tags: "",
      sellTags: [],
      brand: "",
      email: email,
    };
  });

  // Regenerate product ID when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        productId: generateProductId(),
      }));
    }
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (editorRef.current?.destruct) {
        editorRef.current.destruct();
      }
    };
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      description: content,
    }));
  }, [content]);

  const { data: getAllCategories } = useGetAllCategoriesQuery();
  const { data: getAllBrands } = useGetAllBrandsQuery();

  const [uploadAProductBySeller, { isLoading }] =
    useUploadAProductBySellerMutation();

  const subcategories =
    getAllCategories?.find((cat) => cat._id === selectedCategoryId)
      ?.subcategories || [];

  // Get microcategories based on selected subcategory
  const microcategories =
    subcategories?.find((sub) => sub._id === selectedSubcategoryId)
      ?.microcategories || [];

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedImages = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_images");
      formData.append("cloud_name", "dhojflhbx");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dhojflhbx/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        uploadedImages.push(data.secure_url);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
    }));
  };

  // Function to remove an image
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Simple SVG X icon component
  const XIcon = ({ className = "w-5 h-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
        clipRule="evenodd"
      />
    </svg>
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      seller: "seller",
      description: content,
    }));
  }, [content]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const requiredFields = [
        "productName",
        "category",
        "price",
        "stockQuantity",
        "description",
      ];

      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

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
        sellTags: Array.isArray(formData.sellTags) ? formData.sellTags : [],
        shippingFees: {
          insideCity:
            formData.shippingType === "free"
              ? 0
              : parseFloat(formData.shippingFees.insideCity || 0),
          outsideCity:
            formData.shippingType === "free"
              ? 0
              : parseFloat(formData.shippingFees.outsideCity || 0),
        },
        // Ensure these fields are included
        productCondition: formData.productCondition || "new",
        stockStatus: formData.stockStatus || "in-stock",
        shippingType: formData.shippingType || "free",
      };

      // Remove empty or null fields
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const res = await uploadAProductBySeller({
        formData: cleanPayload,
        email: formData?.email,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Failed to create product");
      }

      if (!res?.data) {
        throw new Error("No data received from server");
      }

      Swal.fire({
        title: "Product Added Successfully!",
        icon: "success",
        draggable: true,
      });

      window.location.reload();

      // setFormData("");
      setContent("");
      onOpenChange(false);
    } catch (error) {
      console.error("Detailed submission error:", error);
      Swal.fire({
        title: "Error",
        text:
          error.message || "Failed to create product. Please check your input.",
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <div suppressHydrationWarning>
      <Modal
        placement="center"
        size="3xl"
        scrollBehavior="outside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={handleFormSubmit}
              className="flex justify-center items-center flex-col"
            >
              <ModalHeader className="flex flex-col gap-1">
                Create a product
              </ModalHeader>
              <ModalBody className="w-full">
                {/* Image Upload */}
                <div className="mb-4">
                  <Input
                    label="Upload product images"
                    type="file"
                    className="w-full"
                    multiple
                    onChange={handleImageUpload}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can select multiple images
                  </p>
                </div>

                {/* Image Preview with Remove Option */}
                {formData.images.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Previews
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-white rounded-md p-0.5 shadow-md"
                            aria-label="Remove image"
                          >
                            <XIcon className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Name */}
                <Input
                  label="Product Name"
                  type="text"
                  className="w-full"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  required
                />

                {/* Product ID - Read Only */}
                <Input
                  label="Product ID"
                  type="text"
                  className="w-full"
                  value={formData.productId}
                  isReadOnly
                  description="Automatically generated product ID"
                />

                {/* Brand */}
                <Select
                  className="max-w-full"
                  label="Select a brand"
                  selectedKeys={[formData.brand]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand: e.target.value,
                    })
                  }
                >
                  {getAllBrands?.map((brand) => (
                    <SelectItem key={brand.brandName} value={brand.brandName}>
                      {brand.brandName}
                    </SelectItem>
                  ))}
                </Select>

                {/* Price */}
                <Input
                  label="Product price (৳)"
                  type="number"
                  className="w-full"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  min="0"
                  step="0.01"
                  required
                />

                {/* Category Selection */}
                <Select
                  className="max-w-full"
                  label="Select a category"
                  selectedKeys={[formData.category]}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      subCategory: "",
                      microCategory: "",
                    });
                  }}
                  required
                >
                  {getAllCategories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Subcategory */}
                <Select
                  className="max-w-full"
                  label="Select a sub category"
                  selectedKeys={[formData.subCategory]}
                  isDisabled={!selectedCategoryId}
                  onChange={(e) => {
                    setSelectedSubcategoryId(e.target.value);
                    setFormData({
                      ...formData,
                      subCategory: e.target.value,
                      microCategory: "",
                    });
                  }}
                  required={!!selectedCategoryId}
                >
                  {subcategories?.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Microcategory */}
                <Select
                  className="max-w-full"
                  label="Select a micro category"
                  isDisabled={!selectedSubcategoryId}
                  selectedKeys={[formData.microCategory]}
                  onChange={(e) =>
                    setFormData({ ...formData, microCategory: e.target.value })
                  }
                  required={!!selectedSubcategoryId}
                >
                  {microcategories?.map((micro) => (
                    <SelectItem key={micro._id} value={micro._id}>
                      {micro.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Discount */}
                <Input
                  label="Discount (%)"
                  type="number"
                  className="w-full"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercent: e.target.value,
                    })
                  }
                  min="0"
                  max="100"
                />

                {/* Stock Quantity */}
                <Input
                  label="Stock Quantity"
                  type="number"
                  className="w-full"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                  min="0"
                  required
                />

                {/* Stock Status */}
                <Select
                  label="Stock Status"
                  selectedKeys={[formData.stockStatus]}
                  onChange={(e) =>
                    setFormData({ ...formData, stockStatus: e.target.value })
                  }
                  required
                >
                  {stock.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Shipping Type */}
                <Select
                  className="max-w-full"
                  label="Shipping Type"
                  selectedKeys={[formData.shippingType]}
                  onChange={(e) =>
                    setFormData({ ...formData, shippingType: e.target.value })
                  }
                  required
                >
                  {shipping.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Shipping Fees - Conditionally shown */}
                {formData.shippingType === "Charge applicable" && (
                  <div className="flex gap-3">
                    <Input
                      label="Inside City Shipping Fee (৳)"
                      type="number"
                      value={formData.shippingFees.insideCity || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingFees: {
                            ...formData.shippingFees,
                            insideCity: e.target.value,
                          },
                        })
                      }
                      min="0"
                    />
                    <Input
                      label="Outside City Shipping Fee (৳)"
                      type="number"
                      value={formData.shippingFees.outsideCity || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingFees: {
                            ...formData.shippingFees,
                            outsideCity: e.target.value,
                          },
                        })
                      }
                      min="0"
                    />
                  </div>
                )}

                {/* Product Condition */}
                <Select
                  className="max-w-full"
                  label="Product Condition"
                  selectedKeys={[formData.productCondition]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productCondition: e.target.value,
                    })
                  }
                  required
                >
                  {productCondition?.map((condition) => (
                    <SelectItem key={condition.key} value={condition.key}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Product Tags */}
                <Input
                  label="Product Tags (comma separated)"
                  type="text"
                  className="w-full"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g., electronics, gadget, wireless"
                />

                {/* Sell Tags */}
                <Select
                  className="max-w-full"
                  label="Product Sell Tags"
                  selectionMode="multiple"
                  selectedKeys={formData.sellTags}
                  onSelectionChange={(keys) =>
                    setFormData({ ...formData, sellTags: Array.from(keys) })
                  }
                >
                  {productTags.map((tag) => (
                    <SelectItem key={tag.key}>{tag.label}</SelectItem>
                  ))}
                </Select>

                {/* Description Editor */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <JoditEditor
                    ref={editorRef}
                    value={content}
                    config={useMemo(
                      () => ({
                        height: 300,
                        readonly: false,
                        enableDragAndDropFileToEditor: true,
                        uploader: {
                          insertImageAsBase64URI: true,
                        },
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
                      }),
                      []
                    )}
                    onChange={(newContent) => {
                      // Update content state immediately on change
                      setContent(newContent);
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading}>
                  Add Product
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
