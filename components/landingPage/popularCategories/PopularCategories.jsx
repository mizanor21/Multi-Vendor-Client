"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
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
import { ChevronRight, Sparkles } from "lucide-react";

export default function PopularCategories() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = [
    {
      name: "Computers",
      href: "/categories/computer",
      icon: ComputerIcon,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      color: "#3b82f6",
    },
    {
      name: "Electronics",
      href: "/categories/electronics",
      icon: ElectronicsIcon,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      color: "#a855f7",
    },
    {
      name: "Security",
      href: "/categories/security",
      icon: CameraIcon,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      color: "#10b981",
    },
    {
      name: "Travel",
      href: "/categories/travel",
      icon: TravelIcon,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      color: "#f97316",
    },
    {
      name: "Health",
      href: "/categories/health",
      icon: HealthIcon,
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-50 to-rose-50",
      color: "#ef4444",
    },
    {
      name: "Car & Bike",
      href: "/categories/car-bike",
      icon: CarIcon,
      gradient: "from-slate-600 to-slate-800",
      bgGradient: "from-slate-50 to-slate-100",
      color: "#475569",
    },
    {
      name: "Furniture",
      href: "/categories/furniture",
      icon: FurnitureIcon,
      gradient: "from-amber-600 to-yellow-600",
      bgGradient: "from-amber-50 to-yellow-50",
      color: "#d97706",
    },
    {
      name: "Real Estate",
      href: "/categories/real-estate",
      icon: BuildingIcon,
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50",
      color: "#6366f1",
    },
    {
      name: "Books",
      href: "/categories/books",
      icon: BookIcon,
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50",
      color: "#14b8a6",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Popular Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Explore our trending collections
            </p>
          </div>
        </div>
        <Link
          href="/categories"
          className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Categories Swiper */}
      <Swiper
        freeMode={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="categories-swiper !pb-12"
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 7,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 9,
            spaceBetween: 24,
          },
        }}
      >
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <SwiperSlide key={index}>
              <Link href={category.href}>
                <Card
                  className={`group cursor-pointer border-2 border-transparent transition-all duration-300 h-full ${
                    hoveredIndex === index ? " scale-105" : "shadow-md"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <CardBody className="flex justify-center items-center flex-col p-4 sm:p-6 relative overflow-hidden">
                    {/* Background Gradient (appears on hover) */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    {/* Icon Container with Gradient */}
                    <div className="relative z-10 mb-3 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-300`}
                      ></div>
                      <div className="relative bg-white rounded-2xl p-3 shadow-md group-hover:shadow-xl transition-shadow">
                        <IconComponent size="48px" color={category.color} />
                      </div>
                    </div>

                    {/* Category Name */}
                    <p className="relative z-10 text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900 text-center transition-colors">
                      {category.name}
                    </p>

                    {/* Arrow Icon (appears on hover) */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* View All Button (Mobile) */}
      <div className="md:hidden mt-6 flex justify-center">
        <Link
          href="/categories"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
        >
          View All Categories
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <style jsx global>{`
        .categories-swiper .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 0.5;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }

        .categories-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .group:hover .icon-float {
          animation: float 2s ease-in-out infinite;
        }

        /* Custom scrollbar for consistency */
        .categories-swiper::-webkit-scrollbar {
          height: 6px;
        }

        .categories-swiper::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .categories-swiper::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border-radius: 10px;
        }

        .categories-swiper::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #2563eb, #4f46e5);
        }
      `}</style>
    </div>
  );
}