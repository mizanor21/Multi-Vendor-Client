"use client";
import { Suspense } from "react";
import SellerProductUpdateInfo from "@/components/seller/sellerProducts/sellerProductUpdate/SellerProductUpdate";

export default function SellerProductUpdate() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SellerProductUpdateInfo />
    </Suspense>
  );
}
