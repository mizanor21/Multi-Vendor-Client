import Cart from "@/components/products/cart/Cart";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <div className="mt-8">
      <Suspense fallback={<div>Loading...</div>}>
        <Cart />
      </Suspense>
    </div>
  );
}
