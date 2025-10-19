"use client";
import { Button, Image } from "@heroui/react";
import { useDisclosure } from "@heroui/react";

import React from "react";
import EditSellerProfileModal from "./editSellerProfileModal/EditSellerProfileModal";

export default function SellerProfile() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="">
      <p className="text-center text-5xl font-bold mb-8">Your Profile</p>
      <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
        <div className="max-w-2xl w-full bg-gray-800 text-white rounded-xl shadow-lg p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Image */}
            <Image
              src="https://heroui.com/images/hero-card-complete.jpeg"
              alt="Profile"
              className="w-32 h-32 sm:w-32 sm:h-32 rounded-full border-4 border-gray-600"
            />

            <div className="flex-1 text-center sm:text-left">
              {/* Name and Role */}
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-gray-400">Software Developer</p>

              {/* Edit Profile Button */}
              <Button
                onPress={onOpen}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Edit Profile
              </Button>

              <EditSellerProfileModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <ul className="mt-2 space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                📧 john.doe@example.com
              </li>
              <li className="flex items-center gap-2">📞 +1 (555) 123-4567</li>
              <li className="flex items-center gap-2">📍 San Francisco, CA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
