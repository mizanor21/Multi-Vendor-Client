"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { Image } from "@heroui/image";
import { useGetAllActiveSlidersQuery } from "@/app/api/sliderSlice";

import { useWindowSize } from "@uidotdev/usehooks";

export default function BannerSlider() {
  const size = useWindowSize();
  // console.log("current window size is: ", size?.width);
  const { data: getAllActiveSliders } = useGetAllActiveSlidersQuery();

  // Determine margin-top based on window width
  const getMarginTop = () => {
    if (size?.width === undefined) {
      // Return a default or null if width is not yet available (e.g., during SSR)
      return "0px";
    } else if (size.width < 640) {
      // Small screens (e.g., mobile)
      return "90px"; // Example value for small screens
    } else if (size.width >= 640 && size.width < 768) {
      // Medium-small screens (sm breakpoint)
      return "180px"; // Example value for sm screens
    } else if (size.width >= 768 && size.width < 1024) {
      // Medium screens (md breakpoint)
      return "50px"; // Example value for md screens
    } else {
      // Large screens (lg breakpoint and up)
      return "50px"; // Example value for lg screens
    }
  };

  return (
    // Apply the dynamically calculated margin-top using the style prop
    <div
      className="container mx-auto mb-3 p-3"
      style={{ marginTop: getMarginTop() }}
    >
      <Swiper
        autoHeight={true}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper p-3"
      >
        {getAllActiveSliders?.data?.sliders?.map((slider) => (
          <SwiperSlide key={slider?._id || slider?.image} className="">
            <Image
              alt={slider?.image}
              src={slider?.image}
              width="100%"
              className=""
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
