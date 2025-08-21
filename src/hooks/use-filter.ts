import { ProductStock } from "@prisma/client";
import { create } from "zustand";

export type TFilter = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stock?: ProductStock[] | null;
  brand?: number[] | null;
  location?: number[] | null;
};

export interface FilterState {
  filter: TFilter;
  setFilter: (filter: TFilter) => void;
}

export const useFilter = create<FilterState>((set) => ({
  filter: {
    search: "",
    minPrice: 0,
    maxPrice: 0,
    stock: null,
    brand: null,
    location: null,
  },
  setFilter: (filter: TFilter) =>
    set((state) => ({
      filter: {
        ...state.filter,
        ...filter,
      },
    })),
}));
