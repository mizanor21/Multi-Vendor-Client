"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
import Link from "next/link";
import TkIcon from "@/public/TkIcon";

export default function SimilarProducts({ products }) {
  const list = products?.products || [];

  if (!list.length) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-sm mt-5 mb-10">
        <h2 className="text-2xl font-semibold text-gray-600">
          No Products Found
        </h2>
        <p className="text-gray-400 mt-2">
          Please check back later for similar items.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 mb-10">
      <Swiper
        slidesPerView={1.3}
        breakpoints={{
          640: { slidesPerView: 2.3 },
          768: { slidesPerView: 3.5 },
          1024: { slidesPerView: 4.5 },
          1280: { slidesPerView: 5.5 },
        }}
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
      >
        {list?.map((item, index) => (
          <SwiperSlide key={index}>
            <Link
              className=""
              href={{
                pathname: `/client/product/${item?._id}`,
              }}
            >
              <Card className="relative overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white">
                {/* Discount Ribbon */}
                {item?.discountPercent > 0 && (
                  <div className="absolute right-0 top-0 z-20">
                    <div className="absolute transform rotate-45 bg-green-600 text-white font-bold text-xs px-1 py-1 right-[-35px] top-[30px] w-[150px] text-center shadow-md">
                      {item.discountPercent}% Off
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <CardBody className="overflow-hidden p-0">
                  <Image
                    alt={item.productName}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    radius="none"
                    shadow="none"
                    src={item.images[0]}
                  />
                </CardBody>

                {/* Product Info */}
                <CardFooter className="flex flex-col items-start gap-1 px-4 pt-3 pb-2">
                  <b className="text-gray-900 text-base font-semibold line-clamp-1 hover:text-blue-600 transition-colors">
                    {item.productName}
                  </b>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-sm gap-1">
                    {/* Discounted Price */}
                    <div className="text-green-600 font-bold flex items-center">
                      <TkIcon size="18px" color="#16a34a" className="mr-1" />
                      {item?.price -
                        (item?.discountPercent / 100) * item?.price}
                    </div>

                    {/* Original Price */}
                    {item.discountPercent > 0 && (
                      <div className="line-through text-gray-400 flex items-center text-sm">
                        <TkIcon size="18px" color="#9ca3af" className="mr-1" />
                        {item.price}
                      </div>
                    )}
                  </div>
                </CardFooter>

                {/* CTA Button */}
                <div className="px-4 pb-4 pt-1">
                  <Button
                    color="primary"
                    className="w-full text-white font-semibold text-sm rounded-lg"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
