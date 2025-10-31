'use client'
import FacebookIcon from "@/public/FacebookIcon";
import InstagramIcon from "@/public/InstagramIcon";
import PinterestIcon from "@/public/PinterestIcon";
import YoutubeIcon from "@/public/YoutubeIcon";
import React from "react";
import { Mail, Phone, MapPin, Send, Heart, Shield, Truck, CreditCard } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shopping: [
      { name: "Stall List", href: "/stalls" },
      { name: "Shopping Mall", href: "/mall" },
      { name: "Brand", href: "/brands" },
      { name: "New Arrivals", href: "/new" },
      { name: "Best Sellers", href: "/bestsellers" },
    ],
    knowledge: [
      { name: "Blog", href: "/blog" },
      { name: "FAQ", href: "/faq" },
      { name: "How to Buy", href: "/how-to-buy" },
      { name: "Shipping Info", href: "/shipping" },
    ],
    information: [
      { name: "Contact Us", href: "/contact" },
      { name: "Sell on BDPlaza", href: "/sell" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Return Policy", href: "/returns" },
    ],
  };

  const features = [
    { icon: Truck, text: "Free Shipping", subtext: "On orders over $50" },
    { icon: Shield, text: "Secure Payment", subtext: "100% Protected" },
    { icon: CreditCard, text: "Easy Returns", subtext: "30 Day Guarantee" },
    { icon: Heart, text: "24/7 Support", subtext: "Always Here to Help" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold text-sm">{feature.text}</p>
                    <p className="text-xs text-gray-400">{feature.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              BDPlaza
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted marketplace for quality products. Shop with confidence and enjoy seamless shopping experience with us.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Subscribe to Newsletter</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold flex items-center gap-2">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
                <span>+880 123-456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>support@BDPlaza.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Shopping Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Shopping
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {footerLinks.shopping.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge Base */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Knowledge Base
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {footerLinks.knowledge.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Information
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {footerLinks.information.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} BDPlaza. All rights reserved. Made with{" "}
              <Heart className="inline w-4 h-4 text-red-500 animate-pulse" /> in Bangladesh
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/30  flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:scale-110 group"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/30  flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-transparent transition-all duration-300 hover:scale-110"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/30  flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:scale-110"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/30  flex items-center justify-center hover:bg-red-700 hover:border-red-700 transition-all duration-300 hover:scale-110"
                >
                  <FaPinterest className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs text-gray-400">We Accept:</span>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-white/10 rounded text-xs font-semibold border border-white/20">
                  Visa
                </div>
                <div className="px-3 py-1 bg-white/10 rounded text-xs font-semibold border border-white/20">
                  Mastercard
                </div>
                <div className="px-3 py-1 bg-white/10 rounded text-xs font-semibold border border-white/20">
                  bKash
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </footer>
  );
}