"use client";

import { useFilter } from "@/hooks/use-filter";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function FilterPrice() {
  const { setFilter } = useFilter();
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  // membuat debounce untuk minPrice menggunakan useEffect
  useEffect(() => {
    const debounceInput = setTimeout(() => {
      setFilter({
        minPrice: minPrice,
        maxPrice: maxPrice,
      });
      // console.log(query)
    }, 700);

    return () => clearTimeout(debounceInput);
  }, [minPrice, maxPrice, setFilter]);

  return (
    <>
      <p className="font-semibold leading-[22px]">Range Harga</p>
      <div className="max-w-[480px] w-full bg-white flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
        <div className="flex shrink-0">
          <Image
            width={24}
            height={24}
            src="assets/icons/dollar-circle.svg"
            alt="icon"
          />
        </div>
        <input
          type="number"
          onChange={(e) => setMinPrice(Number(e.target.value))}
          id="minPrice"
          name="minPrice"
          className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
          placeholder="Minimum price"
        />
      </div>
      <div className="max-w-[480px] w-full bg-white flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
        <div className="flex shrink-0">
          <Image
            width={24}
            height={24}
            src="assets/icons/dollar-circle.svg"
            alt="icon"
          />
        </div>
        <input
          type="number"
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          id="maxPrice"
          name="maxPrice"
          className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
          placeholder="Maximum price"
        />
      </div>
    </>
  );
}