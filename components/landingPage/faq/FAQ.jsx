"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openItem, setOpenItem] = useState("1");

  const faqItems = [
    {
      key: "1",
      title: "E-Marketplace",
      content: "BD Plaza is a Trustworthy Online Stall based e-Marketplace for Bangladeshi Buyers & Sellers based on the concept of Trade Fair.",
      icon: "🏪"
    },
    {
      key: "2",
      title: "Buyers",
      content: "Buyers can compare products from multiple sellers and can visit the sellers shop along with the online order facility.",
      icon: "🛍️"
    },
    {
      key: "3",
      title: "Sellers",
      content: "Sellers can Sell products on BD Plaza and can communicate with the Buyers directly.",
      icon: "💼"
    }
  ];

  const toggleItem = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-green-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            What is <span className="text-green-600">BD Plaza</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about Bangladesh's trusted e-marketplace
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleItem(item.key)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-green-600 transition-transform duration-300 ${
                    openItem === item.key ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openItem === item.key
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-6 pt-2">
                  <div className="pl-16 pr-4">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Still have questions?</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}