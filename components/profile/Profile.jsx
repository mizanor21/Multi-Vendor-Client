"use client";
import { useEffect, useState } from "react";
import {
  useGetASingleUserQuery,
  useUpdateProfileMutation,
} from "@/app/api/authSlice";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Loader from "@/utils/loader/Loader";
import { Button } from "@heroui/react";
import LocationIcon from "@/public/LocationIcon";
import { Tooltip } from "@heroui/tooltip";

export default function ProfilePage() {
  const email = Cookies.get("loginInfo");
  const { data: getAnUserData, isLoading: userDataLoader } =
    useGetASingleUserQuery(email);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });

  const [emailStep, setEmailStep] = useState("idle");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Prefill user data
  useEffect(() => {
    if (getAnUserData) {
      setFormData({
        userName: getAnUserData.userName || "",
        email: getAnUserData.email || "",
        phoneNumber: getAnUserData.phoneNumber || "",
        address: getAnUserData.address || "",
        gender: getAnUserData.gender || "",
      });
    }
  }, [getAnUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchAddressFromLocation = () => {
    if (!navigator.geolocation) {
      return Swal.fire(
        "Error",
        "Geolocation is not supported by your browser",
        "error"
      );
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            address: data.display_name || "",
          }));
        } catch {
          Swal.fire("Error", "Unable to fetch address", "error");
        }
      },
      () => Swal.fire("Error", "Unable to retrieve location", "error")
    );
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ formData, email });
      if (res?.data) {
        Swal.fire("Success", "Profile updated.", "success");
      } else {
        Swal.fire(
          "Error",
          res?.error?.data?.error || "Failed to update profile",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", error?.message, "error");
    }
  };

  const handleRequestEmailChange = async () => {
    try {
      const res = await fetch(
        "https://multi-vendor-backend-orpin.vercel.app/api/user/change-email/request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentEmail: formData.email, newEmail }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", data.message, "success");
        setEmailStep("verify");
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleVerifyEmailChange = async () => {
    try {
      const res = await fetch(
        "https://multi-vendor-backend-orpin.vercel.app/api/user/change-email/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentEmail: formData.email,
            code: verificationCode,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", data.message, "success");
        Cookies.set("loginInfo", data.newEmail, { expires: 24 });
        setFormData((prev) => ({ ...prev, email: data.newEmail }));
        setEmailStep("idle");
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (userDataLoader) return <Loader />;

  return (
    <div className="mt-8 px-4 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 mt-4 text-center">
        Update Profile
      </h2>

      {/* Profile update form */}
      <form onSubmit={handleSubmitProfile} className="space-y-4 mt-6">
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="User Name"
          className="w-full border px-4 py-2 rounded"
        />

        {/* Email change section */}
        {emailStep === "idle" && (
          <div className="flex gap-2">
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
            <Button
              onClick={() => setEmailStep("request")}
              className="bg-blue-600 text-white"
            >
              Change
            </Button>
          </div>
        )}

        {emailStep === "request" && (
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
            <Button
              onClick={handleRequestEmailChange}
              className="bg-green-600 text-white"
            >
              Send Code
            </Button>
          </div>
        )}

        {emailStep === "verify" && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
            <Button
              onClick={handleVerifyEmailChange}
              className="bg-purple-600 text-white"
            >
              Verify
            </Button>
          </div>
        )}

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border px-4 py-2 rounded"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex gap-2">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border px-4 py-2 rounded"
          />
          <Tooltip content="Get your location">
            <Button
              isIconOnly
              onClick={fetchAddressFromLocation}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              <LocationIcon size="20px" color="#ffffff" />
            </Button>
          </Tooltip>
        </div>

        <Button
          isLoading={isLoading}
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
}
