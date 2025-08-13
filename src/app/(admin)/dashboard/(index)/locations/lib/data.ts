'use server'
import prisma from "../../../../../../../lib/prisma";

export async function getLocations() {
    try {
        const locations = await prisma.location.findMany({
            select: { id: true, name: true },
            orderBy: { id: "asc" }, // <-- tambahkan ini
        });
        return locations;
    } catch (error) {
        console.log(error);
        return [];
    }
}