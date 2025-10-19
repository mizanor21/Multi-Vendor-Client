import React from "react";
import BannerSlider from "./bannerSlider/BannerSlider";
import PopularCategories from "./popularCategories/PopularCategories";
import RecentProduct from "./recentProduct/RecentProduct";
import AllCategories from "./allCategories/AllCategories";
import FAQ from "./faq/FAQ";
import Footer from "../footer/Footer";

export default function LandingPage() {
  return (
    <div className="nuni">
      <BannerSlider />
      <PopularCategories />
      <RecentProduct />
      <AllCategories />
      <FAQ />
      {/* <Footer /> */}
    </div>
  );
}
