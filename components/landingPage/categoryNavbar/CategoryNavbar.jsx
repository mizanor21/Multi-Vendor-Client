"use client";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { ChevronDown, ChevronRight, Grid3x3, Tag, TrendingUp, Sparkles } from "lucide-react";

export default function CategoryNavbar() {
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [openSubcategoryId, setOpenSubcategoryId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: categories } = useGetAllCategoriesQuery();
  
  const categoryTimeoutRef = useRef(null);
  const subcategoryTimeoutRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Desktop hover handlers with delay
  const handleCategoryMouseEnter = (categoryId) => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setOpenCategoryId(categoryId);
    setOpenSubcategoryId(null);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setOpenCategoryId(null);
      setOpenSubcategoryId(null);
    }, 150);
  };

  const handleSubcategoryMouseEnter = (subcategoryId) => {
    if (subcategoryTimeoutRef.current) {
      clearTimeout(subcategoryTimeoutRef.current);
    }
    setOpenSubcategoryId(subcategoryId);
  };

  const handleSubcategoryMouseLeave = () => {
    subcategoryTimeoutRef.current = setTimeout(() => {
      setOpenSubcategoryId(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    if (subcategoryTimeoutRef.current) {
      clearTimeout(subcategoryTimeoutRef.current);
    }
  };

  // Mobile click handlers
  const handleCategoryClick = (categoryId) => {
    if (window.innerWidth < 1024) {
      setOpenCategoryId(openCategoryId === categoryId ? null : categoryId);
      setOpenSubcategoryId(null);
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    if (window.innerWidth < 1024) {
      setOpenSubcategoryId(
        openSubcategoryId === subcategoryId ? null : subcategoryId
      );
    }
  };

  const handleNavigationClick = () => {
    setIsMobileMenuOpen(false);
    setOpenCategoryId(null);
    setOpenSubcategoryId(null);
  };

  return (
    <>
      <nav
        className={`w-full fixed left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "lg:top-[80px] lg:bg-white/98 lg:backdrop-blur-xl lg:shadow-md"
            : "lg:top-[80px] lg:bg-gradient-to-r from-emerald-400 to-indigo-400 text-sm lg:shadow-lg"
        }`}
      >
        <div className="container mx-auto px-2">
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-center py-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-md transition-all duration-300 `}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <RxCross1 size={24} strokeWidth={0.5} />
              ) : (
                <RxHamburgerMenu size={24} strokeWidth={0.5} />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-center gap-1 py-1.5">
              {categories?.map((category) => (
                <div
                  key={category._id}
                  className="relative group"
                  onMouseEnter={() => handleCategoryMouseEnter(category._id)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <button
                    className={`flex items-center gap-2 px-5 py-3 rounded-md font-semibold transition-all duration-300 ${
                      scrolled
                        ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                        : "text-white hover:bg-white/20 active:bg-white/30"
                    } ${
                      openCategoryId === category._id
                        ? scrolled
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "bg-white/20 shadow-lg"
                        : ""
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    {category.subcategories?.length > 0 && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openCategoryId === category._id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Subcategories Mega Dropdown (Desktop) */}
                  {openCategoryId === category._id &&
                    category.subcategories?.length > 0 && (
                      <div 
                        className="absolute top-full left-0 pt-2"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleCategoryMouseLeave}
                      >
                        <div className="w-80 bg-white rounded-md shadow-2xl border border-gray-100 overflow-hidden animate-slideDown">
                          {/* Header */}
                          <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                              <Tag className="w-4 h-4 text-blue-600" />
                              {category.name}
                            </h3>
                          </div>
                          
                          <div className="p-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {category.subcategories?.map((subcategory, index) => (
                              <div
                                key={subcategory._id}
                                className="relative"
                                onMouseEnter={() =>
                                  handleSubcategoryMouseEnter(subcategory._id)
                                }
                                onMouseLeave={handleSubcategoryMouseLeave}
                              >
                                <Link
                                  href={`/category/${category._id}/${subcategory._id}`}
                                  className={`flex items-center justify-between px-4 py-3.5 rounded-md text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group/item ${
                                    index === 0 ? "mt-0" : "mt-1"
                                  }`}
                                  onClick={handleNavigationClick}
                                >
                                  <span className="font-medium text-sm">
                                    {subcategory.name}
                                  </span>
                                  {subcategory.microcategories?.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400 font-medium">
                                        {subcategory.microcategories.length}
                                      </span>
                                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600 transition-colors" />
                                    </div>
                                  )}
                                </Link>

                                {/* Microcategories Dropdown (Desktop) */}
                                {openSubcategoryId === subcategory._id &&
                                  subcategory.microcategories?.length > 0 && (
                                    <div 
                                      className="absolute left-full top-0 pl-2"
                                      onMouseEnter={handleDropdownMouseEnter}
                                      onMouseLeave={handleSubcategoryMouseLeave}
                                    >
                                      <div className="w-72 bg-white rounded-md shadow-2xl border border-gray-100 overflow-hidden animate-slideRight">
                                        {/* Header */}
                                        <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                                          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-purple-600" />
                                            {subcategory.name}
                                          </h4>
                                        </div>
                                        
                                        <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                          {subcategory.microcategories.map((microcategory, idx) => (
                                            <Link
                                              key={microcategory._id}
                                              href={`/category/${category._id}/${subcategory._id}/${microcategory._id}`}
                                              className={`block px-4 py-3 rounded-md text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200 font-medium text-sm ${
                                                idx === 0 ? "mt-0" : "mt-1"
                                              }`}
                                              onClick={handleNavigationClick}
                                            >
                                              {microcategory.name}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>

                          {/* Footer - View All */}
                          <Link
                            href={`/category/${category._id}`}
                            className="block px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 text-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                            onClick={handleNavigationClick}
                          >
                            View All in {category.name}
                          </Link>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] animate-fadeIn"
          style={{ top: scrolled ? "75px" : "75px" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        className={`lg:hidden fixed right-0 h-full w-[90%] max-w-md bg-white z-[999] shadow-2xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: scrolled ? "75px" : "75px" }}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-md">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">All Categories</h2>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-white hover:bg-white/20 transition-colors active:bg-white/30"
            aria-label="Close menu"
          >
            <RxCross1 size={24} strokeWidth={0.5} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
          <div className="p-4 space-y-2">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="border-2 border-gray-200 rounded-md overflow-hidden hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
              >
                <button
                  onClick={() => handleCategoryClick(category._id)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 active:scale-[0.98]"
                >
                  <span className="font-bold text-gray-800 text-base">
                    {category.name}
                  </span>
                  {category.subcategories?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
                        {category.subcategories.length}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                          openCategoryId === category._id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  )}
                </button>

                {/* Subcategories (Mobile) */}
                {openCategoryId === category._id &&
                  category.subcategories?.length > 0 && (
                    <div className="bg-gray-50 animate-slideDown">
                      {category.subcategories.map((subcategory, index) => (
                        <div key={subcategory._id} className={index === 0 ? "" : "border-t border-gray-200"}>
                          <button
                            onClick={() =>
                              handleSubcategoryClick(subcategory._id)
                            }
                            className="w-full flex items-center justify-between p-4 pl-8 hover:bg-white transition-colors active:bg-blue-50"
                          >
                            <span className="font-semibold text-gray-700 text-sm">
                              {subcategory.name}
                            </span>
                            {subcategory.microcategories?.length > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-400">
                                  {subcategory.microcategories.length}
                                </span>
                                <ChevronRight
                                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                                    openSubcategoryId === subcategory._id
                                      ? "rotate-90"
                                      : ""
                                  }`}
                                />
                              </div>
                            )}
                          </button>

                          {/* Microcategories (Mobile) */}
                          {openSubcategoryId === subcategory._id &&
                            subcategory.microcategories?.length > 0 && (
                              <div className="bg-white animate-slideDown">
                                {subcategory.microcategories.map((microcategory, idx) => (
                                  <Link
                                    key={microcategory._id}
                                    href={`/category/${category._id}/${subcategory._id}/${microcategory._id}`}
                                    className={`block p-3 pl-14 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium text-sm active:bg-purple-100 ${
                                      idx === 0 ? "" : "border-t border-gray-100"
                                    }`}
                                    onClick={handleNavigationClick}
                                  >
                                    {microcategory.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                      
                      {/* View All Subcategories */}
                      <Link
                        href={`/category/${category._id}`}
                        className="block p-4 text-center bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:text-blue-700 font-bold text-sm border-t-2 border-blue-100 transition-colors"
                        onClick={handleNavigationClick}
                      >
                        View All in {category.name}
                      </Link>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Quick Links Section */}
          <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link
                href="/deals"
                className="block p-3 bg-white rounded-md border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all font-semibold text-gray-700 hover:text-green-600 text-sm"
                onClick={handleNavigationClick}
              >
                🔥 Today's Deals
              </Link>
              <Link
                href="/new-arrivals"
                className="block p-3 bg-white rounded-md border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all font-semibold text-gray-700 hover:text-purple-600 text-sm"
                onClick={handleNavigationClick}
              >
                ✨ New Arrivals
              </Link>
              <Link
                href="/bestsellers"
                className="block p-3 bg-white rounded-md border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all font-semibold text-gray-700 hover:text-orange-600 text-sm"
                onClick={handleNavigationClick}
              >
                ⭐ Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed category navbar */}
      <div className="h-[52px] lg:h-[48px]"></div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slideRight {
          animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #6366f1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #4f46e5);
        }
      `}</style>
    </>
  );
}