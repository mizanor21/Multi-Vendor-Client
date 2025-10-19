"use client";
import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";

export default function FAQ() {
  return (
    <div className="container mx-auto mt-10 mb-10">
      <p className="text-center font-bold text-5xl text-[#16a34a]">
        What is BD Plaza?
      </p>
      <Accordion
        defaultExpandedKeys={["1"]}
        variant="splitted"
        className="mt-8 mb-8"
      >
        <AccordionItem key="1" aria-label="Accordion 1" title="E-Marketplace">
          <p className="text-center mb-3">
            BD Plaza is a Trustworthy Online Stall based e-Marketplace for
            Bangladeshi Buyers & Sellers based on the concept of Trade Fair.
          </p>
        </AccordionItem>
        <AccordionItem key="2" aria-label="Accordion 2" title="Buyers">
          <p>
            Buyers can compare products from multiple sellers and can visit the
            sellers shop along with the online order facility.
          </p>
        </AccordionItem>
        <AccordionItem key="3" aria-label="Accordion 3" title="Sellers">
          <p>
            Sellers can Sell products on BD Plaza and can communicate with the
            Buyers directly.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
