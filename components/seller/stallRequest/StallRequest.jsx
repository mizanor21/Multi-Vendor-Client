"use client";
import { useState, useEffect } from "react";
import AddIcon from "@/public/AddIcon";
import DeleteIcon from "@/public/DeleteIcon";
import EditIcon from "@/public/EditIcon";
import { useDisclosure } from "@heroui/react";
import {
  Button,
  Chip,
  Image,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Tooltip,
} from "@heroui/react";
import SellerRequestModal from "./sellerRequestModal/SellerRequestModal";
import StallUpdateModal from "./stallUpdateModal/StallUpdateModal";
import Cookies from "js-cookie";
import {
  useGetAStallByEmailQuery,
  useStallDeleteMutation,
} from "@/app/api/stallSlice";
import Swal from "sweetalert2";
import Loader from "@/utils/loader/Loader";
import { useGetAllOrdersOfAnStallOwnerQuery } from "@/app/api/shippingSlice";
import { useRouter } from "next/navigation";

export default function StallRequest() {
  const router = useRouter();

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();

  const [stallId, setStallId] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isMounted, setIsMounted] = useState(false);
  const [stallInfo, setStallInfo] = useState(null);

  // Initialize component and read cookies
  useEffect(() => {
    setIsMounted(true);
    const cookieData = Cookies.get("stallInfo");
    if (cookieData) {
      setStallInfo(JSON.parse(cookieData));
    }
  }, []);

  useEffect(() => {
    var stallInfo = Cookies.get("stallInfo");

    if (!stallInfo) {
      router.push("/seller/stall-request");
    }
  }, []);

  const { data: getAllOrdersOfAStall, isLoading: ordersLoading } =
    useGetAllOrdersOfAnStallOwnerQuery(stallInfo?.stall?.stallOwnerEmail);

  const totalCompletedOrders = getAllOrdersOfAStall?.filter(
    (order) => order?.status === "completed"
  );

  const {
    data: getUserStall,
    isLoading: userStallLoader,
    refetch,
  } = useGetAStallByEmailQuery(stallInfo?.stall?.stallOwnerEmail);

  const [stallDelete, { isLoading: deleteStallLoader }] =
    useStallDeleteMutation();

  const handleDeleteStall = async (stallId) => {
    if (!stallInfo?.stallOwnerEmail) {
      return Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You are not authorized to delete this stall.",
      });
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await stallDelete(stallId);
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your stall has been deleted.",
          });
          refetch();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Stall not deleted.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error?.message,
        });
      }
    }
  };

  // Wait for component to mount and cookie to be read
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!stallInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <Card className="w-full max-w-md p-6 text-center">
          <CardHeader className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-red-600">Access Required</h2>
            <p className="mt-2 text-gray-600">
              Please log in to manage your stall or create one if you don't have
              an existing stall.
            </p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 mt-6">
            <Button
              color="primary"
              fullWidth
              onClick={() => {
                window.location.href = "/seller/login";
              }}
            >
              Go to Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 text-sm text-gray-500 bg-white">OR</span>
              </div>
            </div>

            <Button
              onPress={onOpen1}
              startContent={<AddIcon size="20px" color="#ffffff" />}
              color="primary"
              fullWidth
            >
              Create New Stall
            </Button>
          </CardBody>
        </Card>

        <SellerRequestModal
          isOpen1={isOpen1}
          onOpenChange1={onOpenChange1}
          onSuccess={() => window.location.reload()}
        />
      </div>
    );
  }

  if (userStallLoader) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-full mx-auto">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="p-6 border-b border-gray-200">
            <div className="flex flex-row items-center justify-between w-full">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  My Stall Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your stall information and track orders
                </p>
              </div>
              {getUserStall?.length > 0 && (
                <div className="mt-4 md:mt-0">
                  <Button
                    onPress={onOpen1}
                    startContent={<AddIcon size="20px" color="#ffffff" />}
                    color="primary"
                  >
                    Add Another Stall
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          {getUserStall?.length === 0 ? (
            <CardBody className="p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-700">
                  No Stall Found
                </h3>
                <p className="mt-2 text-gray-500">
                  You don't have any stall yet. Create your first stall to get
                  started.
                </p>
                <div className="mt-6">
                  <Button
                    onPress={onOpen1}
                    startContent={<AddIcon size="20px" color="#ffffff" />}
                    color="primary"
                    size="lg"
                  >
                    Create New Stall
                  </Button>
                </div>
              </div>
              <SellerRequestModal
                isOpen1={isOpen1}
                onOpenChange1={onOpenChange1}
                onSuccess={refetch}
              />
            </CardBody>
          ) : (
            <>
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "details"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Stall Details
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "orders"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Orders ({totalCompletedOrders?.length || 0})
                  </button>
                </nav>
              </div>

              <CardBody className="p-0 overflow-x-auto">
                {activeTab === "details" ? (
                  <table className="min-w-full divide-y divide-gray-200 overflow-y-scroll">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stall Info
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category & Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 overflow-y-scroll">
                      {getUserStall?.map((stall) => (
                        <tr key={stall?._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-16">
                                <Image
                                  alt={stall?.stallImage}
                                  src={stall?.stallImage}
                                  className="h-16 w-16 rounded-md object-cover"
                                  width={64}
                                  height={64}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {stall?.stallName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {stall?.stallLocation}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  License: {stall?.stallLicenceNumber}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap gap-1">
                                {stall?.stallCategory?.map(
                                  (category, index) => (
                                    <Chip
                                      key={index}
                                      color="success"
                                      size="sm"
                                      variant="flat"
                                    >
                                      {category}
                                    </Chip>
                                  )
                                )}
                              </div>
                              <div>
                                {stall?.stallStatus === "pending" && (
                                  <Chip color="warning" variant="dot">
                                    Pending Approval
                                  </Chip>
                                )}
                                {stall?.stallStatus === "reviewing" && (
                                  <Chip color="secondary" variant="dot">
                                    Under Review
                                  </Chip>
                                )}
                                {stall?.stallStatus === "approved" && (
                                  <Chip color="success" variant="dot">
                                    Approved
                                  </Chip>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {stall?.stallOwnerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stall?.stallOwnerEmail}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stall?.stallOwnerPhoneNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Tooltip content="Edit Stall">
                                <Button
                                  isIconOnly
                                  color="primary"
                                  variant="light"
                                  onClick={() => {
                                    setStallId(stall?._id);
                                    onOpen2();
                                  }}
                                >
                                  <EditIcon size="20px" color="currentColor" />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Delete Stall">
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="light"
                                  isLoading={deleteStallLoader}
                                  onClick={() => handleDeleteStall(stall?._id)}
                                >
                                  <DeleteIcon
                                    size="20px"
                                    color="currentColor"
                                  />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6">
                    {ordersLoading ? (
                      <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Order History
                        </h3>
                        {totalCompletedOrders?.length > 0 ? (
                          <div className="space-y-4">
                            {totalCompletedOrders?.map((order) => (
                              <Card
                                key={order?._id}
                                className="hover:shadow-md transition-shadow"
                              >
                                <CardBody className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">
                                        Order #{order?.orderId}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Completed on{" "}
                                        {new Date(
                                          order?.updatedAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <Chip color="success" size="sm">
                                      Completed
                                    </Chip>
                                  </div>
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">
                              No completed orders yet
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </>
          )}
        </Card>

        <StallUpdateModal
          isOpen2={isOpen2}
          onOpenChange2={onOpenChange2}
          stallId={stallId}
          onSuccess={refetch}
        />
        <SellerRequestModal
          isOpen1={isOpen1}
          onOpenChange1={onOpenChange1}
          onSuccess={refetch}
        />
      </div>
    </div>
  );
}
