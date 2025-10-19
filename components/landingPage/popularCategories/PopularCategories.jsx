"use client";
import React from "react";
import { Card, CardBody } from "@heroui/card";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { FreeMode, Pagination } from "swiper/modules";
import ComputerIcon from "@/public/ComputerIcon";
import ElectronicsIcon from "@/public/ElectronicsIcon";
import CameraIcon from "@/public/CameraIcon";
import TravelIcon from "@/public/TravelIcon";
import HealthIcon from "@/public/HealthIcon";
import CarIcon from "@/public/CarIcon";
import FurnitureIcon from "@/public/FurnitureIcon";
import BuildingIcon from "@/public/BuildingIcon";
import BookIcon from "@/public/BookIcon";
import Link from "next/link";

export default function PopularCategories() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-3xl font-bold mt-10 mb-3 text-center md:text-left">
        Popular Categories
      </p>
      <Swiper
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 15,
          },

          480: {
            slidesPerView: 3,
            spaceBetween: 20,
          },

          768: {
            slidesPerView: 5,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 7,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 9,
            spaceBetween: 30,
          },
        }}
      >
        {/* SwiperSlide for Computers */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/computer"
                className="flex justify-center items-center flex-col text-center"
              >
                <ComputerIcon size="48px" />{" "}
                <p className="mt-2 text-sm md:text-base">Computers</p>{" "}
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/electronics"
                className="flex justify-center items-center flex-col text-center"
              >
                <ElectronicsIcon size="48px" />
                <p className="mt-2 text-sm md:text-base">Electronics</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        {/* SwiperSlide for Security (CameraIcon) */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/security"
                className="flex justify-center items-center flex-col text-center"
              >
                <CameraIcon size="48px" />
                <p className="mt-2 text-sm md:text-base">Security</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        {/* SwiperSlide for Travel */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/travel"
                className="flex justify-center items-center flex-col text-center"
              >
                <TravelIcon size="48px" />
                <p className="mt-2 text-sm md:text-base">Travel</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        {/* SwiperSlide for Health */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/health"
                className="flex justify-center items-center flex-col text-center"
              >
                <HealthIcon size="48px" />
                <p className="mt-2 text-sm md:text-base">Health</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        {/* SwiperSlide for Car & Bike */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/car-bike"
                className="flex justify-center items-center flex-col text-center"
              >
                <CarIcon size="48px" />
                <p className="mt-2 text-sm md:text-base">Car & Bike</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        {/* SwiperSlide for Furniture */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/furniture"
                className="flex justify-center items-center flex-col text-center"
              >
                <FurnitureIcon size="48px" />
                <p className="mt-2 text-sm md:text-base">Furniture</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        {/* SwiperSlide for Real Estate */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/real-estate"
                className="flex justify-center items-center flex-col text-center"
              >
                <BuildingIcon size="48px" />
                <p className="mt-2 text-sm md:text-base">Real Estate</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>

        {/* SwiperSlide for Books */}
        <SwiperSlide>
          <Card className="cursor-pointer hover:bg-blue-100 hover:border-1 mt-3 mb-3">
            <CardBody className="flex justify-center items-center flex-col p-4">
              <Link
                href="/categories/books"
                className="flex justify-center items-center flex-col text-center"
              >
                <BookIcon size="48px" color="#000" />
                <p className="mt-2 text-sm md:text-base">Books</p>
              </Link>
            </CardBody>
          </Card>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
