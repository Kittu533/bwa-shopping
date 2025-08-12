'use server'
import prisma from "../../../../../../../lib/prisma";

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { id: "asc" }, // <-- tambahkan ini
        });
        return categories;
    } catch (error) {
        console.log(error);
        return [];
    }
}