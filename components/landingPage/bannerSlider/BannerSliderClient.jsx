"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";
import { Image } from "@heroui/image";
import { useWindowSize } from "@uidotdev/usehooks";

export default function BannerSliderClient({ sliders }) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [isAutoplayRunning, setIsAutoplayRunning] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const size = useWindowSize();

  const getMarginTop = () => {
    if (size?.width === undefined) return "0px";
    if (size.width < 640) return "90px";
    if (size.width >= 640 && size.width < 768) return "180px";
    if (size.width >= 768 && size.width < 1024) return "50px";
    return "50px";
  };

  const toggleAutoplay = () => {
    if (swiperRef) {
      if (isAutoplayRunning) {
        swiperRef.autoplay.stop();
      } else {
        swiperRef.autoplay.start();
      }
      setIsAutoplayRunning(!isAutoplayRunning);
    }
  };

  const goNext = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  const goPrev = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  return (
    <div className="" style={{ marginTop: getMarginTop() }}>
      <div className="relative group">
        {/* Main Swiper */}
        <Swiper
          onSwiper={setSwiperRef}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          spaceBetween={30}
          effect="creative"
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ["-20%", 0, -1],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Autoplay, EffectCreative, Pagination]}
          className="overflow-hidden"
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider._id}>
              <div className="relative w-full aspect-[21/9] lg:aspect-[21/8] overflow-hidden">
                {/* Image with overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                
                <Image
                  alt={slider?.title || `Slide ${index + 1}`}
                  src={slider.image}
                  className="w-screen h-full object-cover rounded-none transform transition-transform duration-700 group-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                />

                {/* Content overlay */}
                {slider?.title && (
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-8 lg:p-12 transform translate-y-0 transition-transform duration-500">
                    <div className="max-w-2xl">
                      <h2 className="text-white text-3xl lg:text-5xl font-bold mb-3 drop-shadow-lg animate-fade-in">
                        {slider.title}
                      </h2>
                      {slider?.description && (
                        <p className="text-white/90 text-base lg:text-lg mb-6 drop-shadow-md animate-fade-in-delay">
                          {slider.description}
                        </p>
                      )}
                      {slider?.buttonText && (
                        <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl animate-fade-in-delay-2">
                          {slider.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          onClick={goPrev}
          className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={goNext}
          className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Control Panel */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Autoplay Toggle */}
          <button
            onClick={toggleAutoplay}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
            aria-label={isAutoplayRunning ? "Pause autoplay" : "Start autoplay"}
          >
            {isAutoplayRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Slide Counter */}
          <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
            {activeIndex + 1} / {sliders.length}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        /* Custom pagination styles */
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5 !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.3s ease !important;
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          width: 30px !important;
          border-radius: 5px !important;
        }

        .swiper-pagination {
          bottom: 20px !important;
        }
      `}</style>
    </div>
  );
}