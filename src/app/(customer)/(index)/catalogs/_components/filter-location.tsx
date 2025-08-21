import { getLocations } from "@/app/(admin)/dashboard/(index)/locations/lib/data";
import React from "react";
import FilterCheckboxItem from "./filter-checkbox-item";

export default async function FilterLocation() {
  const location = await getLocations();
  return (
    <div className="flex flex-col gap-3">
      {location.map((item) => (
        <FilterCheckboxItem
          key={item.id + item.name}
          id={item.id.toString()}
          value={item.name}
          type="location"
        />
      ))}
    </div>
  );
}
