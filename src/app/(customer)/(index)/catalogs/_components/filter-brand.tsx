import React from "react";
import { getBrands } from "../../lib/data";
import FilterCheckboxItem from "./filter-checkbox-item";

export default async function FilterBrand() {
  const brands = await getBrands();
  return (
    <div className="flex flex-col gap-2">
      {brands.map((item) => (
        <FilterCheckboxItem
          key={item.id + item.name}
          id={item.id.toString()}
          value={item.name}
          type="brand"
        />
      ))}
    </div>
  );
}
