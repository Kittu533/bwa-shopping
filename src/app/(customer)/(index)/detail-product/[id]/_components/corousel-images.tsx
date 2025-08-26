"use client";

import { getImageUrl } from "@/lib/supabase";
import Image from "next/image";
import React from "react";
import Flickity from "react-flickity-component";

const flickityOptions = {
  initialIndex: 0,
  wrapAround: true,
  pageDots: false,
  prevNextButtons: false,
};

interface CorouselImagesProp {
  images: string[];
}

export default function CarouselImages({ images }: CorouselImagesProp) {
  return (
    <div className="overflow-x-hidden w-full">
      <Flickity options={flickityOptions}>
        {images.map((item, i) => (
          <div
            key={item}
            className="bg-white w-[470px] h-[350px] p-10 flex border border-[#E5E5E5] justify-center items-center rounded-[30px] overflow-hidden mr-5"
          >
            <Image
              width={350}
              height={350}
              src={getImageUrl(item, "products")} 
              className="w-full h-full object-contain"
              alt={`thumbnail-${i}`}
            />
          </div>
        ))}
      </Flickity>
    </div>
  );
}