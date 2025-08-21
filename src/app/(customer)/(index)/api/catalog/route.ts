import { getImageUrl } from "@/lib/supabase";
import { TFilter } from "@/hooks/use-filter";
import { Prisma } from "@prisma/client";
import prisma from "../../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const res = (await request.json()) as TFilter;

    const QRQuery: Prisma.ProductWhereInput[] = [];

    // query parameter untuk search
    if (res.search && res.search !== "") {
      QRQuery.push({
        name: {
          contains: res.search,
          mode: "insensitive",
        },
      });
    }

    // query untuk minPrice
    if (res.minPrice && res.minPrice > 0) {
      QRQuery.push({
        price: {
          gte: res.minPrice,
        },
      });
    }
    // query untuk maxPrice
    if (res.maxPrice && res.maxPrice > 0) {
      QRQuery.push({
        price: {
          lte: res.maxPrice,
        },
      });
    }

    // query untuk stock
    if (res.stock && res.stock.length > 0) {
      QRQuery.push({
        stock: {
          in: res.stock,
        },
      });
    }

    // query untuk Brand
    if (res.brand && res.brand.length > 0) {
      QRQuery.push({
        brand: {
          id: {
            in: res.brand,
          },
        },
      });
    }

    // query untuk Location
    if (res.location && res.location.length > 0) {
      QRQuery.push({
        location: {
          id: {
            in: res.location,
          },
        },
      });
    }

    // ambil product
    const products = await prisma.product.findMany({
      where: {
        OR: QRQuery.length > 0 ? QRQuery : undefined,
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // response
    const response = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.images ?? [], // <-- array of string (nama file gambar)
        category_name: product.category.name,
      };
    });
    return Response.json(response);
   
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
