import prisma from "../../../../../../../lib/prisma";


export async function getCustomers() {
    try {
        const customers = await prisma.user.findMany({
            where: {
                role: 'customer'
            },
            include: {
                _count: {
                    select: {
                        orders: true
                    }
                }
            }
        })
        return customers.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            totalTransaction: item._count.orders,

        }));
        return Response.json(customers);
    } catch (error) {
        console.log(error)
        return [];
    }
}