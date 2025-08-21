"use client"

import React from "react";
import CardProduct from "../../_componets/card-product";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../lib/data";
import { useFilter } from "@/hooks/use-filter";

export default function ProductListing() {

  const {filter} = useFilter();

  const{data,isLoading} = useQuery({
    queryKey:['product-listing',filter],
    queryFn: () => fetchProducts(filter)
  })

  if(isLoading){
    return(
       <div className="grid grid-cols-1 gap-4">
        <span>Loading...</span>
       </div>
    )
  }
  return (
    <div className="w-[780px] flex flex-col bg-white p-[30px] gap-[30px] h-fit border border-[#E5E5E5] rounded-[30px]">
      <h2 className="font-bold text-2xl leading-[34px]">Products</h2>

      {/* fetch product dari db lewat CardProduct components */}

      <div className="grid grid-cols-3 gap-[30px]">
        {data?.map((item) => (
          <CardProduct key={item.id + item.name} item={item} />
        ))}
      </div>
    </div>
  );
}
