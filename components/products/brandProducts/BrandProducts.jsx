import React from "react";
import { Card } from "@heroui/card";
import { Image } from "@heroui/react";

export default function BrandProducts({ brandName }) {
  return (
    <div className="mt-3 mb-5">
      <div className="grid 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-3">
        <Card isPressable className="mt-3 p-3 flex justify-center items-center">
          <Image
            alt="HeroUI hero Image"
            src="https://cdn.bdstall.com/brand-image/111.jpg"
            width={100}
          />
        </Card>
        <Card isPressable className="mt-3 p-3 flex justify-center items-center">
          <Image
            alt="HeroUI hero Image"
            src="https://cdn.bdstall.com/brand-image/38.jpg"
            width={100}
          />
        </Card>
        <Card isPressable className="mt-3 p-3 flex justify-center items-center">
          <Image
            alt="HeroUI hero Image"
            src="https://cdn.bdstall.com/brand-image/109.jpg"
            width={100}
          />
        </Card>
        <Card isPressable className="mt-3 p-3 flex justify-center items-center">
          <Image
            alt="HeroUI hero Image"
            src="https://cdn.bdstall.com/brand-image/26.jpg"
            width={100}
          />
        </Card>
        <Card isPressable className="mt-3 p-3 flex justify-center items-center">
          <Image
            alt="HeroUI hero Image"
            src="https://cdn.bdstall.com/brand-image/127.jpg"
            width={100}
          />
        </Card>
        <Card isPressable className="mt-3 p-3 flex justify-center items-center">
          <Image
            alt="HeroUI hero Image"
            src="https://cdn.bdstall.com/brand-image/63.jpg"
            width={100}
          />
        </Card>

      </div>
    </div>
  );
}
