"use client";
import { Button, Image, NumberInput } from "@heroui/react";
import React, { useState } from "react";
import { Input } from "@heroui/input";
import Link from "next/link";
import { useRegisterMutation } from "@/app/api/authSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Registration() {
  const router = useRouter();

  const [registerData, setRegisterData] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "user",
  });

  const [register, { isLoading }] = useRegisterMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrationForm = async (e) => {
    e.preventDefault();
    try {
      const res = await register(registerData);
      // console.log(res);
      if (res?.data) {
        router.push("/verify-email");
        Cookies.set("registeredEmail", registerData?.email, { expires: 24 });
        Swal.fire({
          title: "Registration Done! Now check verify code in your email.",
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.error || "Registration Not Completed!",
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
      setRegisterData({
        userName: "",
        phoneNumber: "",
        email: "",
        password: "",
      });
    }

    // console.log("registerData?.email", registerData?.email);
  };
  return (
    <div className="nuni container mx-auto">
      <section className="h-screen">
        <div className="h-full">
          <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
              <Image
                src="https://i.postimg.cc/nrRP1BM9/DALL-E-2025-03-17-21-43-18-A-professional-and-modern-banner-for-a-multi-vendor-e-commerce-site-reg.webp"
                className=""
                radius="lg"
                // width={300}
                alt="Main_logo"
              />
            </div>

            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
              <form onSubmit={handleRegistrationForm}>
                <p className="mb-10 text-center text-3xl font-bold">
                  Sign Up Account
                </p>
                <div className="relative mb-6" data-twe-input-wrapper-init>
                  <Input
                    label="User Name"
                    type="text"
                    name="userName"
                    value={registerData?.userName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative mb-6" data-twe-input-wrapper-init>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={registerData?.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative mb-6" data-twe-input-wrapper-init>
                  <Input
                    label="Phone number"
                    type="text"
                    name="phoneNumber"
                    value={registerData?.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="relative mb-6" data-twe-input-wrapper-init>
                  <Input
                    label="Enter a password"
                    type="password"
                    name="password"
                    value={registerData?.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-center lg:text-left">
                  <Button
                    isLoading={isLoading}
                    color="primary"
                    className="w-full"
                    type="submit"
                  >
                    Register
                  </Button>

                  <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                    Have an account?
                    <Link
                      href="/auth/login"
                      className="ms-1 text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
