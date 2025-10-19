"use client";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import {
  useGetASingleStallQuery,
  useStallUpdateMutation,
} from "@/app/api/stallSlice";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

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

export default function StallUpdateModal({ isOpen2, onOpenChange2, stallId }) {
  const [stallData, setStallData] = useState({
    stallImage: null,
    stallCategory: [],
    stallOwnerName: "",
    stallLocation: "",
    stallOwnerPhoneNumber: "",
    stallOwnerEmail: "",
    stallLicenceNumber: "",
  });

  const { data: getSingleStall } = useGetASingleStallQuery(stallId);
  const { data: getAllCategories } = useGetAllCategoriesQuery();
  const [stallUpdate, { isLoading: updateLoader }] = useStallUpdateMutation();

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

  useEffect(() => {
    if (getSingleStall) {
      setStallData({
        stallImage: getSingleStall?.stallImage || null,
        stallCategory: getSingleStall?.stallCategory || [],
        stallOwnerName: getSingleStall?.stallOwnerName || "",
        stallLocation: getSingleStall?.stallLocation || "",
        stallOwnerPhoneNumber: getSingleStall?.stallOwnerPhoneNumber || "",
        stallOwnerEmail: getSingleStall?.stallOwnerEmail || "",
        stallLicenceNumber: getSingleStall?.stallLicenceNumber || "",
      });
    }
  }, [getSingleStall]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const {
      stallImage,
      stallCategory,
      stallOwnerName,
      stallLocation,
      stallOwnerPhoneNumber,
      stallOwnerEmail,
    } = stallData;

    if (
      stallCategory.length === 0 ||
      !stallOwnerName ||
      !stallLocation ||
      !stallOwnerPhoneNumber ||
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
        const res = await stallUpdate({ stallData, stallId });
        if (res) {
          Swal.fire({
            title: "Stall Info. Updated!",
            icon: "success",
            draggable: true,
          });
        } else {
          Swal.fire({
            title: "Stall Info. Not Updated!",
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
    } catch (error) {
      Swal.fire({
        title: "Image upload failed. Please try again.",
        icon: "error",
        draggable: true,
      });
    }
  };

  return (
    <div>
      <Modal
        size="3xl"
        scrollBehavior="outside"
        placement="center"
        isOpen={isOpen2}
        onOpenChange={onOpenChange2}
      >
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={handleSubmitForm}
              className="flex justify-center items-center flex-col"
            >
              <ModalHeader className="flex flex-col gap-1">
                Update stall info
              </ModalHeader>
              <ModalBody className="w-full">
                <Input
                  label="Upload a stall logo"
                  type="file"
                  name="stallImage"
                  onChange={handleImageChange}
                />
                {typeof stallData.stallImage === "string" && (
                  <img
                    src={stallData.stallImage}
                    alt="Current Stall"
                    className="w-full h-auto mb-2 rounded"
                  />
                )}
                <Select
                  isRequired
                  className="max-w-full"
                  selectionMode="multiple"
                  label="Change stall category"
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
                <Input
                  label="set stall location"
                  name="stallLocation"
                  isRequired
                  type="text"
                  value={stallData.stallLocation}
                  onChange={handleInputChange}
                />
                <Input
                  label="set stall owner phone number"
                  name="stallOwnerPhoneNumber"
                  isRequired
                  type="text"
                  value={stallData.stallOwnerPhoneNumber}
                  onChange={handleInputChange}
                />
                <Input
                  label="Stall owner email"
                  name="stallOwnerEmail"
                  isRequired
                  type="email"
                  value={stallData.stallOwnerEmail}
                  onChange={handleInputChange}
                />
                <Input
                  label="Set stall license number"
                  name="stallLicenceNumber"
                  type="text"
                  value={stallData.stallLicenceNumber}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" isLoading={updateLoader}>
                  Create
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
