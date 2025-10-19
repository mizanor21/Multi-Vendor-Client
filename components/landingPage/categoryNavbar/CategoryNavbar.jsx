"use client";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import DownIcon from "@/public/DownIcon";
import RightIcon from "@/public/RightIcon";
import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";

export default function CategoryNavbar() {
  const [openCategoryId, setOpenCategoryId] = useState("" || null);
  const [openSubcategoryId, setOpenSubcategoryId] = useState("" || null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: categories } = useGetAllCategoriesQuery();

  const handleCategoryClick = (categoryId) => {
    if (window.innerWidth < 768) {
      setOpenCategoryId(openCategoryId === categoryId ? null : categoryId);
      setOpenSubcategoryId(null);
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    if (window.innerWidth < 768) {
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
    <div className="w-full bg-blue-200 fixed left-0 z-20 shadow-md">
      <div className="container mx-auto px-4">
        <div className="md:hidden flex justify-between items-center py-3">
          <Link href="/" className="font-bold text-lg">
            Categories
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black focus:outline-none"
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
        <div className="hidden md:block text-black">
          <div className="flex justify-center space-x-6 cursor-pointer">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="relative group py-3 hover:bg-blue-300 px-4 transition-colors cursor-pointer"
                onMouseEnter={() => setOpenCategoryId(category._id)}
                onMouseLeave={() => {
                  setOpenCategoryId(null);
                  setOpenSubcategoryId(null);
                }}
              >
                <p className="cursor-pointer flex flex-row justify-center items-center font-semibold text-gray-800 hover:text-gray-900">
                  {category.name}
                  {category.subcategories?.length > 0 && (
                    <DownIcon
                      size="20px"
                      color="#000000"
                      className="w-4 h-4 text-gray-400"
                    />
                  )}
                </p>

                {/* Subcategories Dropdown (Desktop) */}
                {openCategoryId === category._id && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-xl animate-fadeIn">
                    {category.subcategories?.map((subcategory) => (
                      <div
                        key={subcategory._id}
                        className="relative group"
                        onMouseEnter={() =>
                          setOpenSubcategoryId(subcategory._id)
                        }
                        onMouseLeave={() => setOpenSubcategoryId(null)}
                      >
                        <Link
                          href={`/category/${category._id}/${subcategory._id}`}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          onClick={handleNavigationClick}
                        >
                          {subcategory.name}
                          {subcategory.microcategories?.length > 0 && (
                            <RightIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </Link>

                        {/* Microcategories Dropdown (Desktop) */}
                        {openSubcategoryId === subcategory._id &&
                          subcategory.microcategories?.length > 0 && (
                            <div className="absolute left-full top-0 w-56 bg-white rounded-lg shadow-xl py-2 animate-fadeIn">
                              {subcategory.microcategories.map(
                                (microcategory) => (
                                  <Link
                                    key={microcategory._id}
                                    href={`/category/${category._id}/${subcategory._id}/${microcategory._id}`}
                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
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

        {/* Mobile Navigation (Conditional Rendering) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-100 py-2 pb-4 border-t border-blue-300 max-h-[80vh] overflow-y-auto">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="border-b border-blue-200 last:border-b-0"
              >
                <button
                  onClick={() => handleCategoryClick(category._id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-gray-800 hover:bg-blue-200 transition-colors"
                >
                  {category.name}
                  {category.subcategories?.length > 0 && (
                    <span className="ml-2">
                      {openCategoryId === category._id ? (
                        <RxCross1 size={16} />
                      ) : (
                        <DownIcon
                          size="20px"
                          color="#000000"
                          className="w-4 h-4 text-gray-400 rotate-90"
                        />
                      )}
                    </span>
                  )}
                </button>

                {/* Subcategories (Mobile) */}
                {openCategoryId === category._id &&
                  category.subcategories?.length > 0 && (
                    <div className="pl-6 bg-blue-50">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory._id}
                          className="border-b border-blue-100 last:border-b-0"
                        >
                          <button
                            onClick={() =>
                              handleSubcategoryClick(subcategory._id)
                            }
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-100 transition-colors"
                          >
                            {subcategory.name}
                            {subcategory.microcategories?.length > 0 && (
                              <span className="ml-2">
                                {openSubcategoryId === subcategory._id ? (
                                  <RxCross1 size={14} />
                                ) : (
                                  <RightIcon className="w-4 h-4 text-gray-400" />
                                )}
                              </span>
                            )}
                          </button>

                          {/* Microcategories (Mobile) */}
                          {openSubcategoryId === subcategory._id &&
                            subcategory.microcategories?.length > 0 && (
                              <div className="pl-6 bg-blue-100 py-1">
                                {subcategory.microcategories.map(
                                  (microcategory) => (
                                    <Link
                                      key={microcategory._id}
                                      href={`/category/${category._id}/${subcategory._id}/${microcategory._id}`}
                                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-200 transition-colors"
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
        )}
      </div>
    </div>
  );
}
