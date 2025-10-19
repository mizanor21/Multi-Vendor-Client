import ShippingAddress from "@/components/shippingAddress/ShippingAddress";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShippingAddress />
    </Suspense>
  );
}
