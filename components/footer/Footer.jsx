import FacebookIcon from "@/public/FacebookIcon";
import InstagramIcon from "@/public/InstagramIcon";
import PinterestIcon from "@/public/PinterestIcon";
import YoutubeIcon from "@/public/YoutubeIcon";
import React from "react";

export default function Footer() {
  return (
    <div className="bg-blue-200 z-20 ps-3 pe-3">
      <div className="container mx-auto">
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-3 pt-6 pb-6">
          <div>
            <p className="text-2xl font-bold text-[#16a34a]">Shopping</p>
            <ul className="mt-5">
              <li className="hover:underline cursor-pointer">Stall List</li>
              <li className="hover:underline cursor-pointer">Shopping Mall</li>
              <li className="hover:underline cursor-pointer">Brand</li>
            </ul>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#16a34a]">Knowledge Base</p>
            <ul className="mt-5">
              <li className="hover:underline cursor-pointer">Blog</li>
              <li className="hover:underline cursor-pointer">FAQ</li>
            </ul>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#16a34a]">Information</p>
            <ul className="mt-5">
              <li className="hover:underline cursor-pointer">Contact Us</li>
              <li className="hover:underline cursor-pointer">
                Sell on Bdstall
              </li>
              <li className="hover:underline cursor-pointer">Privacy Policy</li>
              <li className="hover:underline cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#16a34a]">Follow Us</p>
            <div className="mt-5 cursor-pointer flex flex-row gap-3">
              <FacebookIcon />
              <InstagramIcon />
              <YoutubeIcon />
              <PinterestIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
