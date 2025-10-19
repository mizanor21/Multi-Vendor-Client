"use client";
import { useLoginMutation } from "@/app/api/authSlice";
import { Button, Form, Image, Input } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(loginData);
      if (res?.data) {
        Cookies.set("loginInfo", res?.data?.user?.email, { expires: 1 });
        Swal.fire({
          title: "Logged in Successfully!",
          icon: "success",
          draggable: true,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/";
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.error || "Login Failed!",
          icon: "error",
          draggable: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message || "Something went wrong",
        icon: "error",
        draggable: true,
      });
    } finally {
      setLoginData({ identifier: "" });
    }
  };

  return (
    <div className="nuni">
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md flex justify-center items-center flex-col">
          <Image
            src="https://i.postimg.cc/G4xDxPLW/multi-vendor-e-com.jpg"
            alt="main_logo"
            radius="none"
            className="mb-3"
          />
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <Form onSubmit={handleLoginFormSubmit} className="w-full">
                <div className="mb-6 w-full" data-twe-input-wrapper-init>
                  <Input
                    label="Enter email address"
                    type="text"
                    className="w-full"
                    name="identifier"
                    value={loginData?.identifier}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Enter your password"
                    type="password"
                    className="w-full mt-5"
                    name="password"
                    value={loginData?.password}
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  <span className="inline-block mr-2">Login</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 inline-block"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Button>
              </Form>
            </div>
            <div className="py-5">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-center sm:text-left whitespace-nowrap">
                  <Link href="/auth/forgot-password">
                    <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 inline-block align-text-top"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="inline-block ml-1">Forgot Password</span>
                    </button>
                  </Link>
                </div>
                <div className="text-center sm:text-right whitespace-nowrap">
                  <Link href="/">
                    <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 inline-block align-text-bottom	"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span className="inline-block ml-1">Help</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link href="/auth/register">
            <p className="mt-5 text-[#006fee]">
              Do not have an account? <span className="font-bold">Sign Up</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
