'use server'
import prisma from "../../../../../../../lib/prisma";

export async function getBrands() {
    try {
        const brands = await prisma.brand.findMany({
            select: { id: true, name: true, logo: true },
            orderBy: { id: "asc" }, // <-- tambahkan ini
        });
        return brands;
    } catch (error) {
        console.log(error);
        return [];
    }
}