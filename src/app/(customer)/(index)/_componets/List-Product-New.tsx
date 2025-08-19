import React from "react";
import { getNewReleaseProduct } from "../lib/data";
import Link from "next/link";
import Image from "next/image";

interface ListProductNewProps {
  title: React.ReactNode;
}
export default async function ListProductNew({ title }: ListProductNewProps) {
  const newProducts = await getNewReleaseProduct();

  return (
    <div id="new-release" className="flex flex-col gap-[30px]">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl leading-[34px]">{title}</h2>
        <a
          href="catalog.html"
          className="p-[12px_24px] border border-[#E5E5E5] rounded-full font-semibold"
        >
          Explore All
        </a>
      </div>
      <div className="grid grid-cols-5 gap-[30px]">
        {newProducts.map((item) => (
          <Link key={item.id} href="details.html" className="product-card">
            <div className="bg-white flex flex-col gap-[24px] p-5 rounded-[20px] ring-1 ring-[#E5E5E5] hover:ring-2 hover:ring-[#FFC736] transition-all duration-300 w-full">
              <div className="w-full h-[90px] flex shrink-0 items-center justify-center overflow-hidden">
                <Image
                  width={90}
                  height={90}
                  src={item.image_url}
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
