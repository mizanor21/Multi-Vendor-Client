"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import Cookies from "js-cookie";
import { useGetASellerAllProductQuery } from "@/app/api/productSlice";
import { Star } from "lucide-react";
import {
  useReplyReviewMutation,
  useReviewDeleteMutation,
  useUpdateReplyReviewMutation,
} from "@/app/api/reviewSlice";
import Swal from "sweetalert2";

const feedbackTypes = [
  { key: "all", label: "All Types" },
  { key: "question", label: "Question" },
  { key: "review", label: "Review" },
];

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
];

export default function SellerFeedback() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const stallInfo = Cookies?.get("stallInfo");
  const email = stallInfo ? JSON.parse(stallInfo)?.stallOwnerEmail : "";

  const { data: sellerProducts } = useGetASellerAllProductQuery(email);
  const [replyReview, { isLoading: replyLoader }] = useReplyReviewMutation();
  const [reviewDelete, { isLoading: deleteReviewLoader }] =
    useReviewDeleteMutation();
  const [UpdateReplyReview, { isLoading: updateReplyLoader }] =
    useUpdateReplyReviewMutation();

  const handleReplySubmit = async (productId, reviewId) => {
    const reply = {
      reply: replyText,
    };
    try {
      const res = await replyReview({ reply, productId, reviewId });
      // console.log(res);
      if (res?.data) {
        Swal.fire({
          title: "Replied!",
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: "You can not make any reply. Try again!",
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
      setActiveReplyId(null);
      setReplyText("");
    }
  };

  const handleDeleteReview = async (productId, reviewId) => {
    // console.log(productId, reviewId);
    try {
      const res = await reviewDelete({ productId, reviewId });
      if (res?.data) {
        Swal.fire("Deleted!", "Review has been deleted.", "success");
      } else {
        Swal.fire("Error", "Failed to delete review.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error?.message, "error");
    }
  };

  const handleUpdateReply = async (productId, reviewId) => {
    // console.log(productId, reviewId);
    if (!replyText.trim()) {
      Swal.fire("Error", "Reply cannot be empty", "error");
      return;
    }
    await handleReplySubmit(productId, reviewId);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredReviews =
    sellerProducts?.products?.flatMap((product) =>
      product?.ratingsAndReviews
        ?.filter(
          (review) =>
            (selectedType === "all" || review.reviewType === selectedType) &&
            (selectedStatus === "all" ||
              product.approvalStatus === selectedStatus) &&
            (selectedRating === "all" ||
              review.rating === parseInt(selectedRating))
        )
        .map((review) => ({ ...review, product }))
    ) || [];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Select
          label="Feedback Type"
          selectedKeys={[selectedType]}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {feedbackTypes.map((type) => (
            <SelectItem key={type.key}>{type.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Status"
          selectedKeys={[selectedStatus]}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statusOptions.map((status) => (
            <SelectItem key={status.key}>{status.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Rating"
          selectedKeys={[selectedRating]}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <SelectItem key="all">All Ratings</SelectItem>
          {[1, 2, 3, 4, 5].map((rating) => (
            <SelectItem key={String(rating)}>{rating} Stars</SelectItem>
          ))}
        </Select>
      </div>

      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reviews found matching your criteria
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-4 mb-4">
                <Image
                  src={review.product.images[0]}
                  alt={review.product.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                  width={80}
                  height={80}
                />
                <div>
                  <h3 className="font-semibold">
                    {review.product.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.userName}</span>
                    <span className="text-gray-500">({review.userEmail})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <Chip
                    color={
                      review.reviewType === "question" ? "primary" : "secondary"
                    }
                  >
                    {review.reviewType}
                  </Chip>
                  <Chip
                    variant="bordered"
                    color={
                      review.product.approvalStatus === "approved"
                        ? "success"
                        : "warning"
                    }
                  >
                    {review.product.approvalStatus}
                  </Chip>
                  <Button
                    variant="ghost"
                    color="danger"
                    isLoading={deleteReviewLoader}
                    size="sm"
                    onClick={() =>
                      handleDeleteReview(review.product._id, review._id)
                    }
                  >
                    Delete Review
                  </Button>
                </div>

                <p className="text-gray-700 mb-4">{review.message}</p>

                {review.reply && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Your Reply:</span>
                      <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveReplyId(review._id);
                          setReplyText(review.reply);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <p className="text-gray-700">{review.reply}</p>
                  </div>
                )}

                {activeReplyId === review._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your response..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        isLoading={replyLoader}
                        onClick={() =>
                          review.reply
                            ? handleUpdateReply(review.product._id, review._id)
                            : handleReplySubmit(review.product._id, review._id)
                        }
                      >
                        {review.reply ? "Update Reply" : "Submit Reply"}
                      </Button>
                      <Button
                        variant="bordered"
                        onClick={() => {
                          setActiveReplyId(null);
                          setReplyText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  !review.reply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveReplyId(review._id)}
                    >
                      Add Reply
                    </Button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
