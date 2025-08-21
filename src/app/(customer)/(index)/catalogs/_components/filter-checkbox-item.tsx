'use client'

import { useFilter } from "@/hooks/use-filter";
import { ProductStock } from "@prisma/client";
import React from "react";

interface FilterCheckboxItemProps {
  id: string;
  value: string;
  type?: "stock" | "brand" | "location";
}

export default function FilterCheckboxItem({
  id,
  value,
  type,
}: FilterCheckboxItemProps) {
  const { filter, setFilter } = useFilter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (type) {
      case "stock":
        // Handle stock filter
        if (e.target.checked) {
          setFilter({
            stock: [...(filter.stock ?? []), e.target.value as ProductStock],
          });
        } else {
          setFilter({
            stock: filter.stock?.filter((item) => item !== e.target.value),
          });
        }
        break;
      case "brand":
        // Handle brand filter
        if (e.target.checked) {
          setFilter({
            brand: [...(filter.brand ?? []), parseInt(e.target.value)],
          });
        } else {
          setFilter({
            brand: filter.brand?.filter((item) => item !== parseInt(e.target.value)),
          });
        }
        break;
      case "location":
        // Handle location filter
          if (e.target.checked) {
          setFilter({
            location: [...(filter.location ?? []), parseInt(e.target.value)],
          });
        } else {
          setFilter({
            location: filter.location?.filter((item) => item !== parseInt(e.target.value)),
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <label
        htmlFor={`${id + value}`}
        className="font-semibold flex items-center gap-3"
      >
        <input
          type="checkbox"
          name="brand"
          id={`${id + value}`} 
          onChange={onChange}
          value={id}
          className="w-6 h-6 flex shrink-0 appearance-none checked:border-[3px] checked:border-solid checked:border-white rounded-md checked:bg-[#0D5CD7] ring-1 ring-[#0D5CD7]"
        />
        <span>{value}</span>
      </label>
    </div>
  );
}
