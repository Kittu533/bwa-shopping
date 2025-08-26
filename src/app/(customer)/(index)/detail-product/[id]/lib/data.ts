import { redirect } from "next/navigation";
import prisma from "../../../../../../../lib/prisma";
import { Images } from "lucide-react";
import { getImageUrl } from "@/lib/supabase";

export async function getProductById(id: number) {
  try {
    const products = await prisma.product.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            orders: true,
          },
        },
        images: true,
        description: true,
        category:{
            select:{
                id:true,
                name:true
            }
        },
        price: true,
      },
    });
    if (!products) {
      redirect("/");
    }
   return {
    ...products,
    image_url: products.images,
  };
  } catch (err) {
    console.log(err);
  }
}
