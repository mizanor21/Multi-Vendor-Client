import SellerFeedback from "@/components/seller/sellerFeedback/SellerFeedback";
import React from "react";

export default function feedbackPage() {
  return (
    <div>
      <p className="text-center text-5xl font-bold mb-8">All Feedbacks</p>
      <SellerFeedback />
    </div>
  );
}
