"use client";
import { useState, useEffect } from "react";
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
import { SwiperSlide } from "swiper/react";
import TkIcon from "@/public/TkIcon";
import moment from "moment";
import { useRouter } from "next/navigation";

import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import Cookies from "js-cookie";
import { useAddToCartMutation } from "@/app/api/cartApiSlice";

// Dynamic imports for client-side only components
const Breadcrumbs = dynamic(
  () => import("@heroui/breadcrumbs").then((mod) => mod.Breadcrumbs),
  { ssr: false }
);
const BreadcrumbItem = dynamic(
  () => import("@heroui/breadcrumbs").then((mod) => mod.BreadcrumbItem),
  { ssr: false }
);
const Image = dynamic(() => import("@heroui/image").then((mod) => mod.Image), {
  ssr: false,
});
const SwiperComponent = dynamic(
  () =>
    import("swiper/react").then((mod) => ({
      default: mod.Swiper,
      SwiperSlide: mod.SwiperSlide,
    })),
  { ssr: false }
);

// Load other components dynamically
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

  const [addToCart, { isLoading: addToCartLoader }] = useAddToCartMutation();

  //get all match products array...
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

  useEffect(() => {
    setIsMounted(true);
    if (getSingleProductData?.product?.images?.[0]) {
      setPreviewImage(getSingleProductData.product.images[0]);
    }
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

  const handleImageSelect = (img) => setPreviewImage(img);

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
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "ul",
      "ol",
      "li",
      "a",
      "br",
      "img",
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

  // Check if ratings array exists and has numbers
  let average = 0; // Initialize average to 0
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
                className={
                  !filterMicroCategory ? "text-[#006fee] font-bold" : ""
                }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
          {/* Preview Image */}
          <div className="relative aspect-h-9 md:aspect-h-3 lg:aspect-h-9 shadow-sm rounded-xl overflow-hidden">
            {previewImage ? (
              <Image
                alt="Product preview"
                src={previewImage}
                fill={true}
                radius="lg"
                className="object-contain"
                priority={true}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse" />
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-2xl md:text-3xl font-bold text-[#16a34a] mb-2">
              {getSingleProductData?.product?.productName || "Product Name"}
            </p>

            {getSingleProductData?.product?.ratingsAndReviews?.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 mt-2 mb-2">
                <div className="flex gap-1">
                  {renderStars(average.toFixed(1))}
                </div>
                <span className="text-slate-400 font-medium text-sm md:text-base">
                  {average.toFixed(1)} out of 5 stars
                </span>
              </div>
            ) : (
              <p className="text-danger-500 text-sm md:text-base">
                This product has no rating yet. Be the first to rate this
                product.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <p className="text-slate-400 text-sm md:text-base">Tag:</p>
              {getSingleProductData?.product?.tags &&
                getSingleProductData.product.tags[0].split(",").map((tag) => (
                  <Chip color="primary" key={tag.trim()} className="text-xs">
                    {tag.trim()}
                  </Chip>
                ))}
            </div>

            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Status:{" "}
              <span className="font-bold text-black">
                {getSingleProductData?.product?.stockStatus}
              </span>
            </p>
            <p className="text-slate-400 text-sm md:text-base">
              ID:{" "}
              <span className="font-bold text-black">
                {getSingleProductData?.product?.productId}
              </span>
            </p>

            {/* Swiper Thumbnail */}
            {isMounted && images?.length > 0 && (
              <div className="mt-5 mb-5">
                <SwiperComponent
                  slidesPerView={2.5}
                  spaceBetween={10}
                  breakpoints={{
                    640: {
                      slidesPerView: 3.5,
                      spaceBetween: 15,
                    },
                    768: {
                      slidesPerView: 4.5,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 5.5,
                      spaceBetween: 25,
                    },
                  }}
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        alt={`Thumbnail ${index}`}
                        src={img}
                        width="100%"
                        height={80}
                        onClick={() => handleImageSelect(img)}
                        className={`rounded-lg border ${
                          previewImage === img
                            ? "border-blue-500"
                            : "border-gray-200"
                        } hover:border-blue-500 transition cursor-pointer object-cover`}
                      />
                    </SwiperSlide>
                  ))}
                </SwiperComponent>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 mb-5">
          <p className="text-center text-2xl md:text-3xl font-bold text-[#16a34a] underline underline-offset-1">
            Price in Bangladesh
          </p>
          <p className="text-base md:text-xl mt-5 mb-5 text-justify">
            Buy{" "}
            <span className="text-primary-500 font-bold">
              {getSingleProductData?.product?.productName || "Product Name"}
            </span>{" "}
            in Bangladesh at Best Price. There are{" "}
            <span className="text-primary-500 font-bold">
              {getAllMatchedProducts?.products?.length}
            </span>{" "}
            stalls in the market. The lowest price is ৳{" "}
            <span className="text-primary-500 font-bold">{minPrice}</span> from
            BD Plaza. The highest price is ৳{" "}
            <span className="text-primary-500 font-bold">{maxPrice}</span> from
            BD Plaza. You can buy from any stall.
          </p>

          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Seller/Stall name & image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product condition
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Enlisted time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getAllMatchedProducts?.products?.map((product) => (
                  <tr
                    key={product?._id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      <Image
                        src={product?.stall?.stallImage}
                        width={60}
                        height={60}
                        alt="seller_name"
                        className="rounded-full object-cover"
                      />
                      <p className="mt-1 text-sm">
                        {product?.stall?.stallOwnerName}
                      </p>
                    </th>
                    <td className="px-6 py-4">
                      {product?.stall?.stallLocation}
                    </td>
                    <td className="px-6 py-4">
                      <Chip color="success" className="text-xs">
                        {product?.productCondition}
                      </Chip>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-600">
                        {product?.discountPercent > 0
                          ? `${product?.discountPercent}`
                          : "0"}
                        %
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <TkIcon size="16" color="#000000" />
                        <p className="font-bold">
                          {(
                            product?.price -
                            (product?.discountPercent / 100) * product?.price
                          ).toFixed(2)}
                        </p>
                      </div>
                      {product?.discountPercent > 0 && (
                        <div className="flex items-center gap-1">
                          <TkIcon size="14" color="gray" />
                          <p className="line-through text-gray-500">
                            {product?.price}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {moment(product?.createdAt).format("MMMM D, YYYY")}
                    </td>
                    <td className="px-6 py-4 flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
                      {product?.sellTags?.map((tag, index) => {
                        if (tag === "Buy Now") {
                          return (
                            <Button
                              onPress={() =>
                                handleShippingFee(product?.stall?._id, product)
                              }
                              key={index}
                              color="primary"
                              size="sm"
                              className="w-full md:w-auto"
                            >
                              Buy Now
                            </Button>
                          );
                        }

                        if (tag === "Call Seller") {
                          return (
                            <Button
                              key={index}
                              color="secondary"
                              size="sm"
                              className="w-full md:w-auto"
                              onClick={() => {
                                const phoneNumber =
                                  product?.stall?.stallOwnerPhoneNumber || "";
                                window.location.href = `tel:${phoneNumber}`;
                              }}
                            >
                              Call Seller
                            </Button>
                          );
                        }

                        if (tag === "Call Whatsapp") {
                          return (
                            <Button
                              key={index}
                              color="success"
                              size="sm"
                              className="w-full md:w-auto"
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
                              Call Whatsapp
                            </Button>
                          );
                        }

                        return null;
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 mb-10">
          <p className="text-center font-bold text-2xl md:text-3xl text-[#16a34a] underline underline-offset-1">
            Full specifications
          </p>

          <div
            className="relative overflow-x-auto sm:rounded-lg mt-5 p-4 bg-white shadow-md"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          ></div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl md:text-3xl font-bold text-[#16a34a] underline underline-offset-1">
              Similar Products
            </p>
            <p className="cursor-pointer text-base md:text-xl hover:underline hover:text-[#16a34a]">
              See all
            </p>
          </div>
          <SimilarProducts products={getSimilarProduct} />
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl md:text-3xl font-bold text-[#16a34a]">
              Popular Speaker List
            </p>
          </div>
          <BrandProducts brandName="JBL" />
        </div>

        <div className="mt-10 mb-10">
          <div className="flex justify-center items-center mb-4">
            {" "}
            {/* Centered heading */}
            <p className="text-2xl md:text-3xl font-bold text-[#16a34a]">
              Write a Question & Review
            </p>
          </div>
          <CommentsSection
            productData="Demo product data" // Consider passing actual relevant data
            getSingleProductData={getSingleProductData}
            getAllMatchedProducts={getAllMatchedProducts}
          />
        </div>
      </div>
    </div>
  );
}
