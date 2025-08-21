import Link from "next/link";
import React from "react";
import { getMostPickProduct } from "../lib/data";
import Image from "next/image";
import { getImageUrl } from "@/lib/supabase";

interface ListProductPickProps {
    title: React.ReactNode;
}
export default async function ListProductPick({ title }: ListProductPickProps) {
  const products = await getMostPickProduct();


  return (
    <div id="picked" className="flex flex-col gap-[30px]">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl leading-[34px]">
          {title}
        </h2>
        <Link
          href="catalog.html"
          className="p-[12px_24px] border border-[#E5E5E5] rounded-full font-semibold"
        >
          Explore All
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-[30px]">
        {products.map((item) => (
          <Link key={item.id} href="#" className="product-card">
            <div className="bg-white flex flex-col gap-[24px] p-5 rounded-[20px] ring-1 ring-[#E5E5E5] hover:ring-2 hover:ring-[#FFC736] transition-all duration-300 w-full">
              <div className="w-full h-[90px] flex shrink-0 items-center justify-center overflow-hidden">
                <Image
                  width={90}
                  height={90}
                  src={getImageUrl(item.image_url?.[0], "products")}
                  className="w-full h-full object-contain"
                  alt="thumbnail"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold leading-[22px]">
                    {item.name}
                  </p>
                  <p className="text-sm text-[#616369]">{item.category.name}</p>
                </div>
                <p className="font-semibold text-[#0D5CD7] leading-[22px]">
                  Rp {item.price.toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
