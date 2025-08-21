import React from "react";
import { getNewReleaseProduct } from "../lib/data";
import CardProduct from "./card-product";

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
          <CardProduct
            key={`${item.name + item.id}`}
            item={{
              id: item.id,
              image_url: Array.isArray(item.image_url) ? item.image_url : [item.image_url], // <-- ini solusi
              name: item.name,
              category_name: item.category.name,
              price: Number(item.price),
            }}
          />
        ))}
      </div>
    </div>
  );
}
