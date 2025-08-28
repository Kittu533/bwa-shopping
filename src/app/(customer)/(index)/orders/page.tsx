import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import Link from 'next/link';
import prisma from "../../../../../lib/prisma";

export default async function OrdersPage() {
  const { session } = await validateRequest();
  
  if (!session) {
    redirect("/sign-in");
  }

  const orders = await prisma.order.findMany({
    where: {
      user_id: session.userId,
    },
    include: {
      products: {  // Gunakan 'products' sesuai schema
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">No orders found</p>
          <Link 
            href="/" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Order {order.code}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.products.map((orderProduct) => (
                  <div key={orderProduct.id} className="flex justify-between">
                    <span>{orderProduct.product.name} x{orderProduct.quantity}</span>
                    <span>Rp {Number(orderProduct.subtotal).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-semibold">Total: Rp {Number(order.total).toLocaleString()}</span>
                <Link 
                  href={`/payment/success?order_code=${order.code}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}