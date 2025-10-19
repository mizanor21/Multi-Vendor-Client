"use client";
import React, { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useGetASingleUserQuery } from "@/app/api/authSlice";
import { useMakeAReviewMutation } from "@/app/api/reviewSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function CommentsSection({
  getSingleProductData,
  getAllMatchedProducts,
}) {
  const router = useRouter();
  const token = Cookies?.get("loginInfo");

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const checkAuth = () => {
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }
    return true;
  };

  // Add error handling for user query
  const { data: getSelfData, error: userError } = useGetASingleUserQuery(token);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [reviewType, setReviewType] = useState("question");
  const [stallInfo, setStallInfo] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  const [makeAReview, { isLoading: makeReviewLoader }] =
    useMakeAReviewMutation();

  const renderStars = (average) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (average >= i) {
        stars.push(<FaStar key={i} />);
      } else if (average >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const ratings = getSingleProductData?.product?.ratingsAndReviews?.map(
    (item) => item?.rating
  );
  const averageRating =
    ratings?.reduce((sum, r) => sum + Number(r), 0) / ratings?.length || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkAuth()) {
      Swal.fire({
        title: "Session Expired",
        text: "Please login again to submit a review",
        icon: "warning",
      }).then(() => router.push("/auth/login"));
      return;
    }
    if (!token || !getSelfData) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to submit a review",
        icon: "warning",
      }).then(() => router.push("/auth/login"));
      return;
    }

    const reviewPayload = {
      userName: getSelfData?.userName || "Unknown",
      userEmail: getSelfData?.email || "unknown@example.com",
      reviewType,
      stallName: stallInfo.name,
      stallEmail: stallInfo.email,
      message,
      rating: selectedRating,
    };
    const productId = getSingleProductData?.product?._id;

    try {
      const res = await makeAReview({ reviewPayload, productId });
      // console.log(res);
      if (res?.data) {
        Swal.fire({
          title: "Your review is submitted!",
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: "Your review not submitted! Please try again.",
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
    } finally {
      setMessage("");
      setReviewType("question");
      setStallInfo({ name: "", email: "" });
      setSelectedRating(0);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Sort reviews by date (newest first)
  const sortedReviews = [
    ...(getSingleProductData?.product?.ratingsAndReviews || []),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p>Redirecting to login...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="nuni">
      <div className="mt-5 flex flex-col">
        <Select
          className="max-w-full"
          label="Select a review option"
          onChange={(e) => setReviewType(e.target.value)}
        >
          <SelectItem key="question" value="question">
            Question
          </SelectItem>
          <SelectItem key="review" value="review">
            Review
          </SelectItem>
        </Select>

        <Select
          className="max-w-full mt-5"
          label="Select a stall"
          onChange={(e) => {
            const selected = getAllMatchedProducts?.products?.find(
              (item) => item?.stall?.stallOwnerEmail === e.target.value
            );
            setStallInfo({
              name: selected?.stall?.stallOwnerName || "",
              email: selected?.stall?.stallOwnerEmail || "",
            });
          }}
        >
          {getAllMatchedProducts?.products?.map((stall) => (
            <SelectItem
              key={stall?.stall?.stallOwnerEmail}
              value={stall?.stall?.stallOwnerEmail}
            >
              {stall?.stall?.stallOwnerName}
            </SelectItem>
          ))}
        </Select>
      </div>

      <section className="mt-6 p-6 bg-white rounded-lg shadow-md border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Rate This Product
        </h2>

        {/* Average Rating Display */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 text-xl">
            {renderStars(averageRating)}
          </div>
          <p className="ml-3 text-sm text-gray-600">
            {averageRating?.toFixed(1)} out of 5 (
            {getSingleProductData?.product?.ratingsAndReviews?.length || 0}{" "}
            reviews)
          </p>
        </div>

        {/* Star Rating Input for new rating */}
        <form
          className="flex items-center gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <fieldset className="flex gap-1 text-xl">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  className="hidden"
                  onClick={() => setSelectedRating(value)}
                />
                <svg
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`w-6 h-6 transition-colors ${
                    (hoverRating || selectedRating) >= value
                      ? "fill-yellow-400"
                      : "fill-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.444a1 1 0 00-.364 1.118l1.287 3.946c.3.922-.755 1.688-1.538 1.118l-3.36-2.444a1 1 0 00-1.176 0l-3.36 2.444c-.783.57-1.838-.196-1.539-1.118l1.287-3.946a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.951-.69l1.285-3.947z" />
                </svg>
              </label>
            ))}
            {/* Optional: Show selected value */}
            <p className="ml-3 text-sm text-gray-700">
              {selectedRating} star{selectedRating !== 1 && "s"}
            </p>
          </fieldset>
          <div className="w-full">
            <label
              htmlFor="ratingMessage"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Your message
            </label>
            <textarea
              id="ratingMessage"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Share your thoughts about this product..."
            ></textarea>
          </div>
          <Button
            isLoading={makeReviewLoader}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
          >
            Submit
          </Button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Customer Reviews (
          {getSingleProductData?.product?.ratingsAndReviews?.length || 0})
        </h2>

        {sortedReviews.length === 0 ? (
          <p className="text-gray-600">
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {review.userName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <p className="mt-3 text-gray-700">{review.message}</p>

                {review.reply && (
                  <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-200">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-blue-600">
                        Seller Reply:
                      </span>
                      <span className="text-gray-600">{review.reply}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
