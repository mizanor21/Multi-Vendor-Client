"use client";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { ChevronDown, ChevronRight, Grid3x3 } from "lucide-react";

export default function CategoryNavbar() {
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [openSubcategoryId, setOpenSubcategoryId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: categories } = useGetAllCategoriesQuery();
  
  const categoryTimeoutRef = useRef(null);
  const subcategoryTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            ? "bg-white/90 backdrop-blur-lg shadow-lg"
            : "bg-[linear-gradient(120deg,rgba(14,165,233,0.9)_0%,rgba(99,102,241,0.9)_100%)]"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Grid3x3 className={`w-6 h-6 ${scrolled ? "text-blue-600" : "text-white"}`} />
              <span className={`font-bold text-lg ${scrolled ? "text-gray-900" : "text-white"}`}>
                Categories
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                scrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/20"
              }`}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <RxCross1 size={24} />
              ) : (
                <RxHamburgerMenu size={24} />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-center gap-1 py-1">
              {categories?.map((category) => (
                <div
                  key={category._id}
                  className="relative group"
                  onMouseEnter={() => handleCategoryMouseEnter(category._id)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <button
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-lg font-medium transition-all duration-300 ${
                      scrolled
                        ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        : "text-white hover:bg-white/20"
                    } ${
                      openCategoryId === category._id
                        ? scrolled
                          ? "bg-blue-50 text-blue-600"
                          : "bg-white/20"
                        : ""
                    }`}
                  >
                    {category.name}
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
                        <div className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown">
                          <div className="p-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {category.subcategories?.map((subcategory) => (
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
                                  className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group/item"
                                  onClick={handleNavigationClick}
                                >
                                  <span className="font-medium">
                                    {subcategory.name}
                                  </span>
                                  {subcategory.microcategories?.length > 0 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600 transition-colors" />
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
                                      <div className="w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideRight">
                                        <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                          {subcategory.microcategories.map(
                                            (microcategory) => (
                                              <Link
                                                key={microcategory._id}
                                                href={`/category/${category._id}/${subcategory._id}/${microcategory._id}`}
                                                className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 font-medium"
                                                onClick={handleNavigationClick}
                                              >
                                                {microcategory.name}
                                              </Link>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
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
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <Grid3x3 className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Categories</h2>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <RxCross1 size={24} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
          <div className="p-4 space-y-2">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
              >
                <button
                  onClick={() => handleCategoryClick(category._id)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                >
                  <span className="font-semibold text-gray-800">
                    {category.name}
                  </span>
                  {category.subcategories?.length > 0 && (
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                        openCategoryId === category._id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Subcategories (Mobile) */}
                {openCategoryId === category._id &&
                  category.subcategories?.length > 0 && (
                    <div className="bg-gray-50 animate-slideDown">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory._id} className="border-t border-gray-200">
                          <button
                            onClick={() =>
                              handleSubcategoryClick(subcategory._id)
                            }
                            className="w-full flex items-center justify-between p-4 pl-8 hover:bg-white transition-colors"
                          >
                            <span className="font-medium text-gray-700">
                              {subcategory.name}
                            </span>
                            {subcategory.microcategories?.length > 0 && (
                              <ChevronRight
                                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                                  openSubcategoryId === subcategory._id
                                    ? "rotate-90"
                                    : ""
                                }`}
                              />
                            )}
                          </button>

                          {/* Microcategories (Mobile) */}
                          {openSubcategoryId === subcategory._id &&
                            subcategory.microcategories?.length > 0 && (
                              <div className="bg-white animate-slideDown">
                                {subcategory.microcategories.map(
                                  (microcategory) => (
                                    <Link
                                      key={microcategory._id}
                                      href={`/category/${category._id}/${subcategory._id}/${microcategory._id}`}
                                      className="block p-3 pl-12 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-t border-gray-100"
                                      onClick={handleNavigationClick}
                                    >
                                      {microcategory.name}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
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
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideRight {
          animation: slideRight 0.3s ease-out;
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
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}