"use client";
import { useGetAllCategoriesQuery } from "@/app/api/categorySlice";
import { useGetAllCategoriesProductQuery } from "@/app/api/productSlice";
import React, { useState, useMemo, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import ProductCard from "../products/productCard/ProductCard";
import Loader from "@/utils/loader/Loader";

export default function CategoryProducts({
  categoryId,
  subcategoryId,
  microCategoryId,
}) {
  const [filters, setFilters] = useState({
    condition: [],
    brand: [],
    priceRange: [],
    inStock: false,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const { data: getAllCategories, isLoading } = useGetAllCategoriesQuery();
  const { data: getAllCategoriesProducts } = useGetAllCategoriesProductQuery({
    categoryId,
    subcategoryId,
    microCategoryId,
  });

  // Make header sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Extract unique brands and conditions from products
  const uniqueBrands = useMemo(() => {
    if (!getAllCategoriesProducts) return [];
    const brands = getAllCategoriesProducts.map((p) => p.brand).filter(Boolean);
    return [...new Set(brands)];
  }, [getAllCategoriesProducts]);

  const uniqueConditions = useMemo(() => {
    if (!getAllCategoriesProducts) return [];
    const conditions = getAllCategoriesProducts
      .map((p) => p.productCondition)
      .filter(Boolean);
    return [...new Set(conditions)];
  }, [getAllCategoriesProducts]);

  // Price ranges with dynamic calculation
  const priceRanges = useMemo(() => {
    if (!getAllCategoriesProducts || getAllCategoriesProducts.length === 0)
      return [];

    // Get all prices and sort them
    const prices = getAllCategoriesProducts
      .map((p) => p.price)
      .filter((price) => !isNaN(price))
      .sort((a, b) => a - b);

    if (prices.length === 0) return [];

    const minPrice = Math.floor(prices[0]);
    const maxPrice = Math.ceil(prices[prices.length - 1]);

    // Calculate dynamic ranges based on price distribution
    const rangeCount = 5;
    const rangeSize = Math.ceil((maxPrice - minPrice) / rangeCount);

    return Array.from({ length: rangeCount }).map((_, i) => {
      const rangeMin = i === 0 ? minPrice : minPrice + i * rangeSize;
      const rangeMax =
        i === rangeCount - 1 ? maxPrice : minPrice + (i + 1) * rangeSize - 1;

      return {
        label:
          i === rangeCount - 1
            ? `৳ ${rangeMin}+`
            : `৳ ${rangeMin} - ${rangeMax}`,
        min: rangeMin,
        max: rangeMax,
        key: `${rangeMin}-${rangeMax}`,
      };
    });
  }, [getAllCategoriesProducts]);

  function getSpecificCategoryData(
    data,
    categoryId,
    subcategoryId,
    microCategoryId
  ) {
    const category = data?.find((cat) => cat?._id === categoryId);
    if (!category) return null;

    const subcategory = subcategoryId
      ? category.subcategories?.find((sub) => sub?._id === subcategoryId)
      : null;

    const microcategory =
      subcategory && microCategoryId
        ? subcategory.microcategories?.find(
            (micro) => micro?._id === microCategoryId
          )
        : null;

    return {
      category,
      subcategory,
      microcategory,
    };
  }

  const result = getSpecificCategoryData(
    getAllCategories,
    categoryId,
    subcategoryId,
    microCategoryId
  );

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (filterType === "inStock") {
        return { ...prev, inStock: !prev.inStock };
      }

      const newValues = prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value];

      return { ...prev, [filterType]: newValues };
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      condition: [],
      brand: [],
      priceRange: [],
      inStock: false,
    });
  };

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    if (!getAllCategoriesProducts) return [];

    return getAllCategoriesProducts.filter((product) => {
      // Condition filter
      if (
        filters.condition.length > 0 &&
        !filters.condition.includes(product.productCondition)
      ) {
        return false;
      }

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Price range filter
      if (filters.priceRange.length > 0) {
        const inPriceRange = filters.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          const price = product.price || 0;
          return price >= min && (isNaN(max) || price <= max);
        });

        if (!inPriceRange) return false;
      }

      // In stock filter
      if (filters.inStock && product.stockStatus !== "in-stock") {
        return false;
      }

      return true;
    });
  }, [getAllCategoriesProducts, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Count how many products match each filter
  const filterCounts = useMemo(() => {
    if (!getAllCategoriesProducts) return {};

    const counts = {
      condition: {},
      brand: {},
      priceRange: {},
    };

    // Count condition occurrences
    uniqueConditions.forEach((condition) => {
      counts.condition[condition] = getAllCategoriesProducts.filter(
        (p) => p.productCondition === condition
      ).length;
    });

    // Count brand occurrences
    uniqueBrands.forEach((brand) => {
      counts.brand[brand] = getAllCategoriesProducts.filter(
        (p) => p.brand === brand
      ).length;
    });

    // Count price range occurrences
    priceRanges.forEach((range) => {
      counts.priceRange[range.key] = getAllCategoriesProducts.filter(
        (p) =>
          (p.price || 0) >= range.min &&
          (isNaN(range.max) || (p.price || 0) <= range.max)
      ).length;
    });

    return counts;
  }, [getAllCategoriesProducts, uniqueConditions, uniqueBrands, priceRanges]);

  // Show loading state
  if (isLoading) {
    return <Loader />;
  }

  // Filter UI components
  const FilterSection = ({ title, children, icon }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="border-b border-gray-200 py-4">
        <button
          className="flex justify-between items-center w-full px-4 text-left font-semibold text-gray-700 hover:text-indigo-600 focus:outline-none rounded-md transition duration-200 ease-in-out"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="flex items-center text-lg">
            {icon && <span className="mr-2 text-xl">{icon}</span>}
            {title}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-300 transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        {isOpen && <div className="mt-3 px-4">{children}</div>}
      </div>
    );
  };

  const FilterCheckbox = ({ label, name, value, checked, onChange, count }) => {
    return (
      <label className="flex items-center justify-between py-2 cursor-pointer text-gray-700 hover:text-gray-900 transition duration-150 ease-in-out">
        <div className="flex items-center">
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={() => onChange(name, value)}
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded-md focus:ring-indigo-500 focus:ring-2 focus:ring-offset-1"
          />
          <span className="ml-3 text-base">{label}</span>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
          {count}
        </span>
      </label>
    );
  };

  const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
    return (
      <div className="w-full bg-white shadow-lg rounded-md p-4 font-sans flex flex-col h-fit">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          <button
            onClick={onReset}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Reset all
          </button>
        </div>

        {/* Condition Filter */}
        <FilterSection title="Item Condition" icon="📦">
          {uniqueConditions.map((condition) => (
            <FilterCheckbox
              key={condition}
              label={condition.charAt(0).toUpperCase() + condition.slice(1)}
              name="condition"
              value={condition}
              checked={filters.condition.includes(condition)}
              onChange={onFilterChange}
              count={filterCounts.condition?.[condition] || 0}
            />
          ))}
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand" icon="🏷️">
          {uniqueBrands.map((brand) => (
            <FilterCheckbox
              key={brand}
              label={brand}
              name="brand"
              value={brand}
              checked={filters.brand.includes(brand)}
              onChange={onFilterChange}
              count={filterCounts.brand?.[brand] || 0}
            />
          ))}
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title="Price Range" icon="💰">
          {priceRanges.map((range) => (
            <FilterCheckbox
              key={range.key}
              label={range.label}
              name="priceRange"
              value={range.key}
              checked={filters.priceRange.includes(range.key)}
              onChange={onFilterChange}
              count={filterCounts.priceRange?.[range.key] || 0}
            />
          ))}
        </FilterSection>

        {/* In Stock Filter */}
        <FilterSection title="Availability">
          <label className="flex items-center justify-between py-2 cursor-pointer text-gray-700 hover:text-gray-900 transition duration-150 ease-in-out">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={filters.inStock}
                onChange={() => onFilterChange("inStock")}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded-md focus:ring-indigo-500 focus:ring-2 focus:ring-offset-1"
              />
              <span className="ml-3 text-base">In Stock Only</span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
              {getAllCategoriesProducts?.filter(
                (p) => p.stockStatus === "in-stock"
              ).length || 0}
            </span>
          </label>
        </FilterSection>

        {/* Active Filters Indicator */}
        {(filters.condition.length > 0 ||
          filters.brand.length > 0 ||
          filters.priceRange.length > 0 ||
          filters.inStock) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-700 mb-2">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {filters.condition.map((cond) => (
                <span
                  key={cond}
                  className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md flex items-center"
                >
                  {cond}
                  <button
                    onClick={() => handleFilterChange("condition", cond)}
                    className="ml-1 text-indigo-600 hover:text-indigo-900"
                    aria-label={`Remove ${cond} filter`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.brand.map((brand) => (
                <span
                  key={brand}
                  className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md flex items-center"
                >
                  {brand}
                  <button
                    onClick={() => handleFilterChange("brand", brand)}
                    className="ml-1 text-indigo-600 hover:text-indigo-900"
                    aria-label={`Remove ${brand} filter`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.priceRange.map((range) => {
                const [min, max] = range.split("-");
                return (
                  <span
                    key={range}
                    className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md flex items-center"
                  >
                    ৳{min} - {max === "Infinity" ? "∞" : max}
                    <button
                      onClick={() => handleFilterChange("priceRange", range)}
                      className="ml-1 text-indigo-600 hover:text-indigo-900"
                      aria-label={`Remove price range filter`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {filters.inStock && (
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md flex items-center">
                  In Stock
                  <button
                    onClick={() => handleFilterChange("inStock")}
                    className="ml-1 text-indigo-600 hover:text-indigo-900"
                    aria-label="Remove in stock filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-10 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className={`${isSticky ? "pt-16" : ""}`}>
        <Breadcrumbs className="mt-3 mb-3">
          <BreadcrumbItem>{result?.category?.name}</BreadcrumbItem>
          {result?.subcategory?.name && (
            <BreadcrumbItem>{result?.subcategory?.name}</BreadcrumbItem>
          )}
          {result?.microcategory?.name && (
            <BreadcrumbItem>{result?.microcategory?.name}</BreadcrumbItem>
          )}
        </Breadcrumbs>
      </div>

      {/* Mobile filter dialog */}
      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-40 ${
            mobileFiltersOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          />
        </div>

        <div
          className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl transform ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
            <div className="mt-4 p-4 border-t border-gray-200">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150"
              >
                Show {filteredProducts.length} products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky header for mobile */}
      {isSticky && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 py-3 px-4 lg:hidden">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center text-gray-700"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
            <span className="text-sm font-medium">
              {filteredProducts.length} products
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row bg-gray-100 font-inter">
        {/* Sidebar for filters - desktop */}
        <aside className="hidden lg:block w-full lg:w-72 xl:w-80 flex-shrink-0 p-4">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6">
          <div className="bg-white p-4 sm:p-6 rounded-md shadow-md">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                products
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </h2>
              {(filters.condition.length > 0 ||
                filters.brand.length > 0 ||
                filters.priceRange.length > 0 ||
                filters.inStock) && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear filters
                </button>
              )}
            </div>

            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {currentProducts.map((item, i) => (
                    <ProductCard item={item} key={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-1 sm:space-x-2">
                      {/* Previous button */}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
                      >
                        Previous
                      </button>

                      {/* Page numbers */}
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === "number"
                              ? setCurrentPage(page)
                              : null
                          }
                          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md border text-sm sm:text-base ${
                            page === currentPage
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          } ${
                            typeof page !== "number" ? "cursor-default" : ""
                          }`}
                          disabled={typeof page !== "number"}
                        >
                          {page}
                        </button>
                      ))}

                      {/* Next button */}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-200 border-2 border-dashed rounded-md w-16 h-16 mx-auto flex items-center justify-center text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search for something else
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset all filters
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 lg:hidden"
                  >
                    Change filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
