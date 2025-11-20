"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form } from "@heroui/react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import { useGetAllBrandsQuery } from "@/app/api/brandSlice";
import { useUploadAProductBySellerMutation } from "@/app/api/stallSlice";
import Swal from "sweetalert2";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

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

// Move editor config outside the component to avoid hook order issues
const editorConfig = {
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
};

export default function SellerAddProduct() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const editorRef = useRef(null);

  const generateProductId = () =>
    Math.floor(10000 + Math.random() * 90000).toString();

  const [formData, setFormData] = useState(() => {
    const stallInfo = Cookies.get("stallInfo");
    var email = "";

    if (stallInfo) {
      try {
        const parsed = JSON.parse(stallInfo);
        email = parsed?.stall?.stallOwnerEmail || "";
      } catch (err) {}
    }

    return {
      images: [],
      productName: "",
      productId: generateProductId(),
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

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
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
        productCondition: formData.productCondition || "new",
        stockStatus: formData.stockStatus || "in-stock",
        shippingType: formData.shippingType || "free",
      };

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
      setContent("");
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

  if (!mounted) return null;

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Create a Product</h2>
      <Form
        onSubmit={handleFormSubmit}
        className="flex justify-center items-center flex-col"
      >
        {/* Image Upload */}
        <div className="mb-4 w-full">
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

        {formData.images.length > 0 && (
          <div className="mb-4 w-full">
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
                  >
                    ❌
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

        {/* Product ID */}
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
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          min="0"
          step="0.01"
          required
        />

        {/* Category */}
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

        {formData.shippingType === "Charge applicable" && (
          <div className="flex gap-3 w-full">
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
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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

        {/* Description */}
        <div className="mt-4 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description <span className="text-red-500">*</span>
          </label>
          <JoditEditor
            ref={editorRef}
            value={content}
            config={editorConfig}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 w-full">
          <Button color="primary" type="submit" isLoading={isLoading}>
            Add Product
          </Button>
        </div>
      </Form>
    </section>
  );
}
