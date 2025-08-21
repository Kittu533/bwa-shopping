import { Tproduct } from "./../../../../../types/index";
import { TFilter } from "@/hooks/use-filter";

export async function fetchProducts(body?: TFilter): Promise<Tproduct[]> {
  const res = await fetch('api/catalog',{
    method:'POST',
    body: JSON.stringify(body ?? {}),
  })

  const data = await res.json();
  return data ?? [];
}
  