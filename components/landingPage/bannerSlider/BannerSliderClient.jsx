"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight, Pause, Play, ShoppingBag } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { Autoplay, EffectCreative, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import { Image } from "@heroui/image";
import { useWindowSize } from "@uidotdev/usehooks";
import Link from "next/link";

export default function BannerSliderClient({ sliders }) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [isAutoplayRunning, setIsAutoplayRunning] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const size = useWindowSize();
  const progressInterval = useRef(null);

  // Responsive margin calculation
  const getMarginTop = useCallback(() => {
    if (!size?.width) return "0px";
    if (size.width < 640) return "90px";
    if (size.width >= 640 && size.width < 768) return "180px";
    if (size.width >= 768 && size.width < 1024) return "50px";
    return "50px";
  }, [size?.width]);

  // Progress bar animation
  useEffect(() => {
    if (isAutoplayRunning && !isHovered) {
      setProgress(0);
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + (100 / 40); // 4000ms / 100ms intervals
        });
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isAutoplayRunning, isHovered, activeIndex]);

  // Navigation handlers
  const goNext = useCallback(() => {
    if (swiperRef) {
      swiperRef.slideNext();
      setProgress(0);
    }
  }, [swiperRef]);

  const goPrev = useCallback(() => {
    if (swiperRef) {
      swiperRef.slidePrev();
      setProgress(0);
    }
  }, [swiperRef]);

  const goToSlide = useCallback((index) => {
    if (swiperRef) {
      swiperRef.slideTo(index);
      setProgress(0);
    }
  }, [swiperRef]);

  // Handle mouse enter/leave for autoplay pause
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (swiperRef && isAutoplayRunning) {
      swiperRef.autoplay.stop();
    }
  }, [swiperRef, isAutoplayRunning]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (swiperRef && isAutoplayRunning) {
      swiperRef.autoplay.start();
    }
  }, [swiperRef, isAutoplayRunning]);

  if (!sliders || sliders.length === 0) {
    return null;
  }

  return (
    <div 
      className="container mx-auto overflow-hidden p-4 lg:px-0" 
      style={{ marginTop: getMarginTop() }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative group">
        {/* Main Swiper */}
        <Swiper
          onSwiper={setSwiperRef}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            setProgress(0);
          }}
          spaceBetween={0}
          effect="creative"
          speed={800}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ["-20%", 0, -1],
              opacity: 0.5,
            },
            next: {
              translate: ["100%", 0, 0],
              opacity: 0,
            },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          loop={sliders.length > 1}
          modules={[Autoplay, EffectCreative, Pagination, Keyboard, Mousewheel]}
          className="overflow-hidden rounded-lg"
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider._id || index}>
              <div className="relative w-full aspect-[21/12] sm:aspect-[18/7] lg:aspect-[21/7] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Multi-layer gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-10" />
                
                {/* Image with Ken Burns effect */}
                <Image
                  alt={slider?.title || `Slide ${index + 1}`}
                  src={slider.image}
                  className="w-full h-full object-cover transform transition-all duration-[8000ms] ease-out group-hover:scale-110"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  removeWrapper
                />

                {/* Content overlay with better structure */}
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-2xl lg:max-w-3xl">
                      {/* Category badge */}
                      {slider?.category && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-fade-slide-up">
                          <ShoppingBag className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium uppercase tracking-wider">
                            {slider.category}
                          </span>
                        </div>
                      )}

                      {/* Title with better typography */}
                      {slider?.title && (
                        <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 drop-shadow-2xl leading-tight animate-fade-slide-up-delay-1">
                          {slider.title}
                        </h2>
                      )}

                      {/* Description with improved readability */}
                      {slider?.description && (
                        <p className="text-white/95 text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 drop-shadow-lg max-w-xl leading-relaxed animate-fade-slide-up-delay-2">
                          {slider.description}
                        </p>
                      )}

                      {/* CTA buttons with better design */}
                      {(slider?.buttonText || slider?.link) && (
                        <div className="flex flex-wrap items-center gap-4 animate-fade-slide-up-delay-3">
                          {slider?.link ? (
                            <Link
                              href={slider.link}
                              className="group/btn inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
                            >
                              <span>{slider.buttonText || "Shop Now"}</span>
                              <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          ) : (
                            <button className="group/btn inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl">
                              <span>{slider.buttonText}</span>
                              <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                          )}

                          {/* Secondary CTA if available */}
                          {slider?.secondaryButtonText && (
                            <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 hover:border-white/50">
                              {slider.secondaryButtonText}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative elements for premium feel */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl z-10" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-3xl z-10" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Enhanced Navigation Buttons */}
        <button
          onClick={goPrev}
          className="hidden lg:flex absolute left-4 xl:left-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-white/50 text-gray-900 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl hover:shadow-2xl"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>

        <button
          onClick={goNext}
          className="hidden lg:flex absolute right-4 xl:right-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-white/50 text-gray-900 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl hover:shadow-2xl"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {/* Thumbnail navigation for desktop */}
        {sliders.length > 1 && (
          <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 items-center gap-3 px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {sliders.map((slider, index) => (
              <button
                key={slider._id || index}
                onClick={() => goToSlide(index)}
                className={`relative w-16 h-10 rounded-md overflow-hidden transition-all duration-300 border-2 ${
                  activeIndex === index
                    ? "border-white scale-110 shadow-xl"
                    : "border-white/30 hover:border-white/60 hover:scale-105 opacity-70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <Image
                  src={slider.image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  removeWrapper
                />
              </button>
            ))}
          </div>
        )}

        {/* Mobile slide indicators */}
        <div className="flex lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30 items-center gap-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-white w-8"
                  : "bg-white/50 w-2 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-slide-up {
          animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fade-slide-up-delay-1 {
          animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }

        .animate-fade-slide-up-delay-2 {
          animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .animate-fade-slide-up-delay-3 {
          animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
        }

        /* Enhanced pagination styles */
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5 !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          width: 32px !important;
          border-radius: 4px !important;
          background: white !important;
        }

        .swiper-pagination {
          bottom: 24px !important;
        }

        @media (max-width: 1024px) {
          .swiper-pagination {
            display: none !important;
          }
        }

        /* Smooth transitions */
        .swiper-slide {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}