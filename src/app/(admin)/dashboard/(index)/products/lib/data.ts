'use server';

import prisma from "../../../../../../../lib/prisma";

export async function getProducts(): Promise<Array<{
    id: number;
    name: string;
    price: number;          // ubah ke number saja
    stock: string;
    images: string[];
    brand: string;
    category: string;
    location: string;
}>> {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                images: true,
                brand: { select: { name: true } },
                category: { select: { name: true } },
                location: { select: { name: true } },
            },
            orderBy: { id: 'asc' },
        });

        return products.map((item) => ({
            id: item.id,
            name: item.name,
            price: typeof item.price === 'bigint' ? Number(item.price) : item.price, // konversi bigint ke number
            stock: item.stock,
            images: item.images ?? [],
            brand: item.brand?.name ?? "",
            category: item.category?.name ?? "",
            location: item.location?.name ?? "",
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}