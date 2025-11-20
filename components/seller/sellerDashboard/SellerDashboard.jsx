import CartIcon from "@/public/CartIcon";
import FeedBackIcon from "@/public/FeedBackIcon";
import OrderIcon from "@/public/OrderIcon";
import ProductIcon from "@/public/ProductIcon";

export default function SellerDashboard() {
  return (
    <div className="w-full h-screen">
      <p className="text-center font-bold text-5xl mb-4 text-blue-700">
        Seller Dashboard
      </p>

      <div className="">
        <div className="grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-4 sm:px-8">
          <div className="flex items-center bg-white border rounded-md overflow-hidden shadow">
            <div className="p-4 bg-green-400">
              <ProductIcon size="48px" color="#ffffff" />
            </div>
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total Products</h3>
              <p className="text-3xl">12,768</p>
            </div>
          </div>
          <div className="flex items-center bg-white border rounded-md overflow-hidden shadow">
            <div className="p-4 bg-blue-400">
              <OrderIcon size="48px" color="#ffffff" />
            </div>
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total Order</h3>
              <p className="text-3xl">39,265</p>
            </div>
          </div>
          <div className="flex items-center bg-white border rounded-md overflow-hidden shadow">
            <div className="p-4 bg-indigo-400">
              <CartIcon size="48px" color="#ffffff" />
            </div>
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Saved Products</h3>
              <p className="text-3xl">142,334</p>
            </div>
          </div>
          <div className="flex items-center bg-white border rounded-md overflow-hidden shadow">
            <div className="p-4 bg-red-400">
              <FeedBackIcon size="48px" color="#ffffff" />
            </div>
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Feedback</h3>
              <p className="text-3xl">34.12%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
