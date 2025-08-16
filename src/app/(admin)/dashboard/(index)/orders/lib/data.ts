import prisma from "../../../../../../../lib/prisma";


export async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return orders.map((item) => ({
            id: item.id,
            customerName: item.user.name,
            price: Number(item.total),
            products: item.products.map((p) => ({
                name: p.product.name,
                image: p.product.images[0]
            })),
            status: item.status,
        }));
        return Response.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}