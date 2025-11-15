import React from "react";
import BannerSlider from "./bannerSlider/BannerSlider";
import PopularCategories from "./popularCategories/PopularCategories";
import RecentProduct from "./recentProduct/RecentProduct";
import AllCategories from "./allCategories/AllCategories";
import FAQ from "./faq/FAQ";

export default function LandingPage() {
  return (
    <div className="">
      <BannerSlider />
      <PopularCategories />
      <RecentProduct />
      <AllCategories />
      <FAQ />
    </div>
  );
}
