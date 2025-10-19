import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useCreateAStallMutation } from "@/app/api/stallSlice";

import Cookies from "js-cookie";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";

import { useRouter } from "next/navigation";

export const animals = [
  { key: "computer", label: "Computer" },
  { key: "electronics", label: "Electronics" },
  { key: "security & industry", label: "Security & Industry" },
  { key: "travels", label: "Travels" },
  { key: "health & beauty", label: "Health & Beauty" },
  { key: "household", label: "Household" },
  { key: "car & bike", label: "Car & Bike" },
  { key: "real estate", label: "Real Estate" },
];

export default function SellerRequestModal({ isOpen1, onOpenChange1 }) {
  const router = useRouter();

  const [stallData, setStallData] = useState({
    stallImage: null,
    stallCategory: [],
    stallOwnerName: "",
    stallLocation: "",
    stallOwnerPhoneNumber: "",
    stallOwnerEmail: "",
    stallLicenceNumber: "",
    stallStatus: "pending",
    stallProducts: [],
    stallPoints: 0,
    password: "",
  });

  const [createAStall, { isLoading }] = useCreateAStallMutation();
  const { data: getAllCategories } = useGetAllCategoriesQuery();

  // Input text handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStallData((prev) => ({ ...prev, [name]: value }));
  };

  // File input handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setStallData((prev) => ({ ...prev, stallImage: file }));
  };

  // Select change handler
  const handleCategoryChange = (selectedKeys) => {
    setStallData((prev) => ({ ...prev, stallCategory: [...selectedKeys] }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const {
      stallImage,
      stallCategory,
      stallOwnerName,
      stallOwnerEmail,
      password,
    } = stallData;

    if (
      stallCategory.length === 0 ||
      !stallImage ||
      !stallOwnerName ||
      !password ||
      !stallOwnerEmail
    ) {
      Swal.fire({
        title: "Fill up all the fields.",
        icon: "error",
        draggable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", stallImage);
      formData.append("upload_preset", "unsigned_images");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dhojflhbx/image/upload",
        formData
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      const fullData = {
        ...stallData,
        stallImage: imageUrl,
      };

      try {
        const res = await createAStall(fullData)?.unwrap();

        if (res) {
          Cookies.set("stallInfo", JSON.stringify(res), {
            expires: 7,
          });
          window.location.reload();
          router.push("/seller/dashboard");
          Swal.fire({
            title: "Stall Request Submitted.",
            text: "Please wait for accept your request.",
            icon: "success",
            draggable: true,
          });
        } else {
          Swal.fire({
            title: "Stall Request Not Submitted.",
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
        setStallData({
          stallImage: null,
          stallCategory: [],
          stallOwnerName: "",
          stallLocation: "",
          stallOwnerPhoneNumber: "",
          stallOwnerEmail: "",
          stallLicenceNumber: "",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Image upload failed. Please try again.",
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <Modal size="4xl" isOpen={isOpen1} onOpenChange={onOpenChange1}>
      <ModalContent>
        {(onClose) => (
          <Form
            onSubmit={handleSubmitForm}
            className="flex justify-center items-center flex-col"
          >
            <ModalHeader className="flex flex-col gap-1">
              Create a stall
            </ModalHeader>
            <ModalBody className="w-full">
              <Input
                label="Upload a stall logo"
                type="file"
                name="stallImage"
                onChange={handleImageChange}
              />
              <Select
                isRequired
                className="max-w-full"
                selectionMode="multiple"
                label="Select stall category"
                selectedKeys={stallData.stallCategory}
                onSelectionChange={handleCategoryChange}
              >
                {getAllCategories?.map((animal) => (
                  <SelectItem key={animal.name}>{animal.name}</SelectItem>
                ))}
              </Select>
              <Input
                label="Stall name"
                name="stallOwnerName"
                isRequired
                type="text"
                value={stallData.stallOwnerName}
                onChange={handleInputChange}
              />
              {/* <Input
                label="Stall location"
                name="stallLocation"
                isRequired
                type="text"
                value={stallData.stallLocation}
                onChange={handleInputChange}
              />
              <Input
                label="Stall owner phone number"
                name="stallOwnerPhoneNumber"
                isRequired
                type="text"
                value={stallData.stallOwnerPhoneNumber}
                onChange={handleInputChange}
              /> */}
              <Input
                label="Stall owner email"
                name="stallOwnerEmail"
                isRequired
                type="email"
                value={stallData.stallOwnerEmail}
                onChange={handleInputChange}
              />
              {/* <Input
                label="Stall license number"
                name="stallLicenceNumber"
                type="text"
                value={stallData.stallLicenceNumber}
                onChange={handleInputChange}
              /> */}
              <Input
                label="Password"
                name="password"
                type="password"
                value={stallData.password}
                onChange={handleInputChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Create
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
