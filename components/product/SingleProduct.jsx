"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import sanitizeHtml from "sanitize-html";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import {
  useGetASingleProductQuery,
  useGetMatchedProductsQuery,
  useGetSimilarProductsQuery,
} from "@/app/api/productSlice";
import Loader from "@/utils/loader/Loader";
import { Button, Chip } from "@heroui/react";
import TkIcon from "@/public/TkIcon";
import moment from "moment";
import { useRouter } from "next/navigation";

import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { MdZoomIn, MdZoomOut, MdClose } from "react-icons/md";
import Swal from "sweetalert2";

import Cookies from "js-cookie";
import { useAddToCartMutation } from "@/app/api/cartApiSlice";

// Dynamic imports
const Breadcrumbs = dynamic(
  () => import("@heroui/breadcrumbs").then((mod) => mod.Breadcrumbs),
  { ssr: false }
);
const BreadcrumbItem = dynamic(
  () => import("@heroui/breadcrumbs").then((mod) => mod.BreadcrumbItem),
  { ssr: false }
);

const SimilarProducts = dynamic(() =>
  import("@/components/products/similarProducts/SimilarProducts")
);
const BrandProducts = dynamic(() =>
  import("@/components/products/brandProducts/BrandProducts")
);
const CommentsSection = dynamic(() =>
  import("@/components/products/commentsSection/CommentsSection")
);

export default function SingleProduct() {
  const params = useParams();
  const id = params.slug;
  const router = useRouter();

  const userEmail = Cookies?.get("loginInfo");

  const [isMounted, setIsMounted] = useState(false);

  const { data: getSingleProductData, isLoading: singleProductLoader } =
    useGetASingleProductQuery(id);
  const { data: getAllCategories } = useGetAllCategoriesQuery();
  const { data: getSimilarProduct } = useGetSimilarProductsQuery(id);
  const { data: getAllMatchedProducts } = useGetMatchedProductsQuery(
    getSingleProductData?.product?.productName
  );

  const [addToCart] = useAddToCartMutation();

  const products = getAllMatchedProducts?.products || [];

  let minPrice = 0;
  let maxPrice = 0;

  if (products.length > 0) {
    const prices = products.map((p) => p.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  const images = getSingleProductData?.product?.images || [];
  const [previewImage, setPreviewImage] = useState(images[0] || null);

  // Hybrid Zoom States
  const [isMobile, setIsMobile] = useState(false);
  
  // External Zoom (Desktop)
  const [isExternalZooming, setIsExternalZooming] = useState(false);
  const [externalZoomPosition, setExternalZoomPosition] = useState({ x: 50, y: 50 });
  const [showExternalPanel, setShowExternalPanel] = useState(false);
  const [externalZoomLevel, setExternalZoomLevel] = useState(2);
  
  // Internal Zoom (Mobile)
  const [isInternalZooming, setIsInternalZooming] = useState(false);
  const [internalZoomLevel, setInternalZoomLevel] = useState(1);
  const [internalPosition, setInternalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageContainerRef = useRef(null);
  const externalPanelRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    if (getSingleProductData?.product?.images?.[0]) {
      setPreviewImage(getSingleProductData.product.images[0]);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [getSingleProductData]);

  if (!isMounted) return <Loader />;
  if (singleProductLoader) return <Loader />;
  if (getSingleProductData?.product?.approvalStatus !== "approved") {
    return (
      <div className="container mx-auto text-center mt-20">
        <h1 className="text-2xl font-bold text-red-600">
          This product is not available or not approved
        </h1>
      </div>
    );
  }

  // ==================== EXTERNAL ZOOM HANDLERS (DESKTOP) ====================
  const handleExternalMouseMove = (e) => {
    if (!imageContainerRef.current || isMobile) return;

    const container = imageContainerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setExternalZoomPosition({ x: xPercent, y: yPercent });
  };

  const handleExternalMouseEnter = () => {
    if (!isMobile && previewImage) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExternalZooming(true);
        setShowExternalPanel(true);
      }, 200);
    }
  };

  const handleExternalMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsExternalZooming(false);
    setShowExternalPanel(false);
  };

  const handleExternalZoomIn = () => {
    setExternalZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleExternalZoomOut = () => {
    setExternalZoomLevel(prev => Math.max(prev - 0.5, 1.5));
  };

  // ==================== INTERNAL ZOOM HANDLERS (MOBILE) ====================
  const handleInternalImageClick = () => {
    if (isMobile && previewImage) {
      setIsInternalZooming(true);
      setInternalZoomLevel(2);
      setInternalPosition({ x: 0, y: 0 });
    }
  };

  const handleInternalZoomIn = () => {
    setInternalZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleInternalZoomOut = () => {
    setInternalZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setIsInternalZooming(false);
        setInternalPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleInternalClose = () => {
    setIsInternalZooming(false);
    setInternalZoomLevel(1);
    setInternalPosition({ x: 0, y: 0 });
  };

  const handleTouchStart = (e) => {
    if (!isInternalZooming) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - internalPosition.x,
      y: touch.clientY - internalPosition.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isInternalZooming || !isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Constrain movement
    const maxX = (internalZoomLevel - 1) * 150;
    const maxY = (internalZoomLevel - 1) * 150;
    
    setInternalPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleImageSelect = (img) => {
    setPreviewImage(img);
    setIsExternalZooming(false);
    setShowExternalPanel(false);
    setIsInternalZooming(false);
    setInternalZoomLevel(1);
    setInternalPosition({ x: 0, y: 0 });
  };

  // ==================== OTHER HANDLERS ====================
  const filterCategory = getAllCategories?.find(
    (category) => category?._id === getSingleProductData?.product?.category
  );

  const filterSubCategory = filterCategory?.subcategories?.find(
    (sub) => sub?._id === getSingleProductData?.product?.subCategory
  );
  const filterMicroCategory = filterSubCategory?.microcategories?.find(
    (micro) => micro?._id === getSingleProductData?.product?.microCategory
  );

  const cleanHTML = sanitizeHtml(getSingleProductData?.product?.description, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "b", "strong", "i", "em", "u",
      "ul", "ol", "li", "a", "br", "img",
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "data"],
    transformTags: {
      "*": (tagName, attribs) => {
        delete attribs.style;
        return { tagName, attribs };
      },
    },
  });

  const ratings = getSingleProductData?.product?.ratingsAndReviews?.map(
    (rating) => rating?.rating
  );

  let average = 0;
  if (ratings && ratings.length > 0) {
    const total = ratings.reduce((sum, current) => sum + current, 0);
    average = total / ratings.length;
  }

  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (averageRating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (averageRating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  const handleShippingFee = async (stallId, product) => {
    const cartData = {
      userEmail: userEmail,
      productId: product?._id,
      quantity: 1,
    };

    if (!userEmail) {
      Swal.fire({
        title: "Maybe you aren't logged in.",
        text: "Please login again to continue",
        icon: "warning",
      }).then(() => {
        router.push("/auth/login");
      });
      return;
    }

    try {
      const res = await addToCart(cartData);
      if (res?.data) {
        Swal.fire({
          title: "Product add to your cart.",
          icon: "success",
          draggable: true,
        });
        router.push(`/client/cart`);
      } else {
        Swal.fire({
          title: "Product cann't add to your cart.",
          icon: "error",
          draggable: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <div>
      <div className="mt-8 container mx-auto px-4 md:px-6 lg:px-8 nuni">
        {isMounted && (
          <Breadcrumbs className="pt-3 pb-3">
            <BreadcrumbItem
              className={!filterSubCategory ? "text-[#006fee] font-bold" : ""}
            >
              <p>{filterCategory?.name || "Category"}</p>
            </BreadcrumbItem>

            {filterSubCategory && (
              <BreadcrumbItem
                className={!filterMicroCategory ? "text-[#006fee] font-bold" : ""}
              >
                <p className="text-[#006fee]">{filterSubCategory.name}</p>
              </BreadcrumbItem>
            )}

            {filterMicroCategory && (
              <BreadcrumbItem className="font-bold">
                <p className="text-[#006fee]">{filterMicroCategory.name}</p>
              </BreadcrumbItem>
            )}
          </Breadcrumbs>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
          {/* Image Gallery Section */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnail Column */}
            {isMounted && images?.length > 0 && (
              <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto py-4 lg:py-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 lg:max-h-[500px]">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageSelect(img)}
                    className={`flex-shrink-0 min-w-[70px] w-[70px] h-[70px] rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                      previewImage === img
                        ? "border-blue-500 shadow-lg scale-105 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300 hover:scale-105"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div className="order-1 lg:order-2 flex-1 relative">
              {/* DESKTOP: External Zoom */}
              {!isMobile && (
                <div
                  ref={imageContainerRef}
                  className="relative flex justify-center items-center p-4 md:p-10 bg-white rounded-lg shadow-lg overflow-hidden cursor-crosshair"
                  onMouseMove={handleExternalMouseMove}
                  onMouseEnter={handleExternalMouseEnter}
                  onMouseLeave={handleExternalMouseLeave}
                  style={{ minHeight: '400px' }}
                >
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Product preview"
                        className="max-w-full max-h-[500px] object-contain select-none"
                        draggable="false"
                      />

                      {/* Zoom Controls - Desktop */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {!isExternalZooming && (
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg transition-all hover:scale-105">
                            <MdZoomIn className="text-xl text-blue-500" />
                          </div>
                        )}
                        
                        {isExternalZooming && (
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg space-y-1">
                            <button
                              onClick={handleExternalZoomIn}
                              className="block p-1 hover:bg-blue-50 rounded transition-colors"
                            >
                              <MdZoomIn className="text-lg text-blue-500" />
                            </button>
                            <div className="border-t border-gray-200" />
                            <button
                              onClick={handleExternalZoomOut}
                              className="block p-1 hover:bg-blue-50 rounded transition-colors"
                            >
                              <MdZoomOut className="text-lg text-blue-500" />
                            </button>
                            <div className="text-center text-xs text-gray-600 px-1">
                              {externalZoomLevel.toFixed(1)}x
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Magnifying Lens */}
                      {isExternalZooming && (
                        <div
                          className="absolute w-24 h-24 border-3 border-blue-500 rounded-lg pointer-events-none bg-white/5 backdrop-blur-[0.5px] shadow-2xl z-10 transition-all duration-100"
                          style={{
                            left: `${externalZoomPosition.x}%`,
                            top: `${externalZoomPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <div className="absolute inset-0 border-2 border-white/50 rounded-lg" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
                  )}
                </div>
              )}

              {/* MOBILE: Internal Zoom */}
              {isMobile && (
                <div
                  className="relative flex justify-center items-center p-4 bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{ minHeight: '400px' }}
                  onClick={!isInternalZooming ? handleInternalImageClick : undefined}
                >
                  {previewImage ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Product preview"
                        className="max-w-full max-h-[500px] object-contain select-none transition-transform duration-200"
                        draggable="false"
                        style={{
                          transform: `scale(${internalZoomLevel}) translate(${internalPosition.x / internalZoomLevel}px, ${internalPosition.y / internalZoomLevel}px)`,
                          cursor: isInternalZooming ? 'grab' : 'zoom-in'
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      />

                      {/* Mobile Zoom Controls */}
                      {isInternalZooming && (
                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                          <button
                            onClick={handleInternalClose}
                            className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                          >
                            <MdClose className="text-xl text-red-500" />
                          </button>
                          <button
                            onClick={handleInternalZoomIn}
                            className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                          >
                            <MdZoomIn className="text-xl text-blue-500" />
                          </button>
                          <button
                            onClick={handleInternalZoomOut}
                            className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                          >
                            <MdZoomOut className="text-xl text-blue-500" />
                          </button>
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs text-center font-semibold">
                            {internalZoomLevel.toFixed(1)}x
                          </div>
                        </div>
                      )}

                      {/* Tap to zoom hint */}
                      {!isInternalZooming && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                          Tap to zoom
                        </div>
                      )}

                      {/* Drag hint */}
                      {isInternalZooming && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg text-sm backdrop-blur-sm shadow-lg">
                          <span className="font-semibold">{internalZoomLevel.toFixed(1)}x</span> - Drag to explore
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
                  )}
                </div>
              )}

              {/* External Zoom Panel - Desktop Only */}
              {!isMobile && showExternalPanel && previewImage && (
                <div
                  ref={externalPanelRef}
                  className="absolute left-full ml-6 top-0 w-[650px] h-[580px] bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200 z-50 transition-all duration-200"
                  style={{
                    backgroundImage: `url(${previewImage})`,
                    backgroundSize: `${externalZoomLevel * 100}%`,
                    backgroundPosition: `${externalZoomPosition.x}% ${externalZoomPosition.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-md px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-lg">
                    {externalZoomLevel.toFixed(1)}x Zoom
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {getSingleProductData?.product?.productName || "Product Name"}
            </h1>

            {/* Rating Section */}
            {getSingleProductData?.product?.ratingsAndReviews?.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3 py-3 border-y border-gray-200">
                <div className="flex gap-1">
                  {renderStars(average.toFixed(1))}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {average.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm md:text-base">
                  ({getSingleProductData?.product?.ratingsAndReviews?.length} reviews)
                </span>
              </div>
            ) : (
              <p className="text-danger-500 text-sm py-3 border-y border-gray-200">
                This product has no rating yet. Be the first to rate this product.
              </p>
            )}

            {/* Tags */}
            {getSingleProductData?.product?.tags && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-600 font-medium text-sm md:text-base">Tags:</span>
                {getSingleProductData.product.tags[0].split(",").map((tag) => (
                  <Chip
                    key={tag.trim()}
                    color="primary"
                    variant="flat"
                    className="text-xs md:text-sm"
                  >
                    {tag.trim()}
                  </Chip>
                ))}
              </div>
            )}

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-gray-500 text-xs md:text-sm">Status</p>
                <p className="font-bold text-base md:text-lg">
                  {getSingleProductData?.product?.stockStatus}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-xs md:text-sm">Product ID</p>
                <p className="font-bold text-base md:text-lg break-all">
                  {getSingleProductData?.product?.productId}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg p-4 space-y-2 border border-gray-100">
              <h3 className="font-semibold text-base md:text-lg mb-3">Key Features</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                  <span>Authentic Product</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                  <span>Fast Delivery Available</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                  <span>Multiple Payment Options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 md:p-8">
            <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[#16a34a] mb-6">
              Price in Bangladesh
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
              Buy{" "}
              <span className="text-primary-500 font-bold">
                {getSingleProductData?.product?.productName}
              </span>{" "}
              in Bangladesh at Best Price. There are{" "}
              <span className="text-primary-500 font-bold">
                {getAllMatchedProducts?.products?.length}
              </span>{" "}
              sellers available. Price ranges from ৳{" "}
              <span className="text-primary-500 font-bold">{minPrice}</span> to ৳{" "}
              <span className="text-primary-500 font-bold">{maxPrice}</span>.
            </p>
          </div>

          {/* Sellers Table */}
          <div className="mt-8 overflow-x-auto shadow-xl rounded-lg">
            <table className="w-full text-xs md:text-sm text-left min-w-[800px]">
              <thead className="text-xs uppercase bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th scope="col" className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-700">
                    Seller
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-700">
                    Location
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-700">
                    Condition
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-700">
                    Discount
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-700">
                    Price
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-700">
                    Listed
                  </th>
                  <th scope="col" className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getAllMatchedProducts?.products?.map((product, index) => (
                  <tr
                    key={product?._id}
                    className={`border-b transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50`}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <img
                          src={product?.stall?.stallImage}
                          alt="seller"
                          className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border-2 border-gray-200 flex-shrink-0"
                        />
                        <p className="font-medium text-gray-900 text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                          {product?.stall?.stallOwnerName}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 text-xs md:text-sm">
                      {product?.stall?.stallLocation}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <Chip color="success" variant="flat" size="sm" className="text-xs">
                        {product?.productCondition}
                      </Chip>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="font-bold text-green-600 text-sm md:text-lg">
                        {product?.discountPercent > 0
                          ? `${product?.discountPercent}%`
                          : "0%"}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <TkIcon size="14" color="#000000" />
                          <p className="font-bold text-sm md:text-lg">
                            {(
                              product?.price -
                              (product?.discountPercent / 100) * product?.price
                            ).toFixed(2)}
                          </p>
                        </div>
                        {product?.discountPercent > 0 && (
                          <div className="flex items-center gap-1">
                            <TkIcon size="12" color="gray" />
                            <p className="line-through text-gray-400 text-xs md:text-sm">
                              {product?.price}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                      {moment(product?.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {product?.sellTags?.map((tag, tagIndex) => {
                          if (tag === "Buy Now") {
                            return (
                              <Button
                                onPress={() =>
                                  handleShippingFee(product?.stall?._id, product)
                                }
                                key={tagIndex}
                                color="primary"
                                size="sm"
                                className="font-semibold text-xs"
                              >
                                Buy Now
                              </Button>
                            );
                          }

                          if (tag === "Call Seller") {
                            return (
                              <Button
                                key={tagIndex}
                                color="secondary"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  const phoneNumber =
                                    product?.stall?.stallOwnerPhoneNumber || "";
                                  window.location.href = `tel:${phoneNumber}`;
                                }}
                              >
                                Call
                              </Button>
                            );
                          }

                          if (tag === "Call Whatsapp") {
                            return (
                              <Button
                                key={tagIndex}
                                color="success"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  const whatsappNumber =
                                    product?.stall?.stallOwnerPhoneNumber || "";
                                  const message = encodeURIComponent(
                                    "Hello, I'm interested in your product."
                                  );
                                  window.open(
                                    `https://wa.me/${whatsappNumber}?text=${message}`,
                                    "_blank"
                                  );
                                }}
                              >
                                WhatsApp
                              </Button>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12 mb-12">
          <h2 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl text-[#16a34a] mb-8">
            Full Specifications
          </h2>
          <div
            className="bg-white rounded-lg shadow-xl p-4 md:p-6 lg:p-8 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          />
        </div>

        {/* Similar Products */}
        <div className="mt-12 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#16a34a]">
              Similar Products
            </h2>
            <button className="text-primary-500 hover:text-primary-600 font-semibold transition-colors text-sm md:text-base">
              See all →
            </button>
          </div>
          <SimilarProducts products={getSimilarProduct} />
        </div>

        {/* Brand Products */}
        <div className="mt-12 mb-12">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#16a34a]">
              Popular Speaker List
            </h2>
          </div>
          <BrandProducts brandName="JBL" />
        </div>

        {/* Comments Section */}
        <div className="mt-12 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#16a34a]">
              Questions & Reviews
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Share your experience with this product
            </p>
          </div>
          <CommentsSection
            productData="Demo product data"
            getSingleProductData={getSingleProductData}
            getAllMatchedProducts={getAllMatchedProducts}
          />
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}