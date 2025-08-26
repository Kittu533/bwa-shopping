import { getImageUrl } from "@/lib/supabase";
import prisma from "../../../../../lib/prisma";
import { cookies } from "next/headers";

// Fetch categories from the database
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Produk paling banyak terjual
export async function getMostPickProduct() {
  try {
    const mostPickedProducts = await prisma.product.findMany({
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      select: {
        images: true,
        id: true,
        name: true,
        category: { select: { name: true } },
        price: true,
      },
      take: 10,
    });

    return mostPickedProducts.map((item) => ({
      ...item,
      image_url: item.images, // <-- array of string (nama file gambar)
      category_name: item.category.name,
    }));
  } catch (error) {
    console.error("Error fetching most picked products:", error);
    return [];
  }
}

// Produk terbaru
export async function getNewReleaseProduct() {
  try {
    const newReleaseProducts = await prisma.product.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        images: true,
        id: true,
        name: true,
        category: { select: { name: true } },
        price: true,
      },
      take: 10, 
    });

    return newReleaseProducts.map((item) => ({
      ...item,
      image_url: item.images, // <-- array of string (nama file gambar)
      category_name: item.category.name,
    }));
  } catch (error) {
    console.error("Error fetching new release products:", error);
    return [];
  }
}

// fetch brands from the database
export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
      },
    });

    return brands.map((item) => ({
      ...item,
      logo: getImageUrl(item.logo, "brands"),
    }));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}
// export async function getUserFromSession() {
//   const session = await getServerSession(authOptions);
//   return session?.user || null;
// }
