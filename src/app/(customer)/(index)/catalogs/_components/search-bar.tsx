'use client'

import { useFilter } from "@/hooks/use-filter";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default  function SearchBar() {

    const {setFilter} = useFilter()
    const [query,setQuery] = useState<string>("")

    // membuat debounce untuk query search menggunakan useEffect
    useEffect(() =>{
        const debounceInput = setTimeout(() => {
            setFilter({
                search: query
            })
            // console.log(query)
        }, 700)

        return () => clearTimeout(debounceInput)
    },[query,setFilter])

  return (
    <div>
      {" "}
      <form
        action=""
        className="max-w-[480px] w-full bg-white flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300"
      >
        <input
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          id=""
          name=""
          className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
          placeholder="Search product by name, brand, category"
        />
        <button type="submit" className="flex shrink-0">
          <Image
            width={24}
            height={24}
            src="assets/icons/search-normal.svg"
            alt="icon"
          />
        </button>
      </form>
    </div>
  );
}
