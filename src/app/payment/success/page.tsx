import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import prisma from "../../../../lib/prisma";
import Link from 'next/link';

interface SearchParams {
  order_code?: string;
}

async function SuccessContent({ searchParams }: { searchParams: SearchParams }) {
  const orderCode = searchParams.order_code;
  
  if (!orderCode) {
    redirect('/');
  }

  // Gunakan relasi 'products' sesuai schema
  const order = await prisma.order.findUnique({
    where: {
      code: orderCode,
    },
    include: {
      products: {  // Bukan 'orderProducts' tapi 'products'
        include: {
          product: true,
        },
      },
      detail: true,  // Bukan 'orderDetail' tapi 'detail'
    },
  });

  if (!order) {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your order has been confirmed and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Code:</span>
              <span className="font-semibold">{order.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {order.status === 'pending' ? 'Processing' : order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-lg">Rp {Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          {/* Products */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Items Ordered:</h3>
            <div className="space-y-3">
              {order.products.map((orderProduct) => (
                <div key={orderProduct.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{orderProduct.product.name}</span>
                    <span className="text-gray-600 ml-2">x{orderProduct.quantity}</span>
                  </div>
                  <span className="font-semibold">
                    Rp {Number(orderProduct.subtotal).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.detail && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Shipping Address:</h3>
              <div className="text-gray-600">
                <p className="font-medium text-black">{order.detail.name}</p>
                <p>{order.detail.address}</p>
                <p>{order.detail.city}, {order.detail.postal_code}</p>
                <p>Phone: {order.detail.phone}</p>
                {order.detail.notes && (
                  <p className="mt-2 text-sm">Notes: {order.detail.notes}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link 
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/orders"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            View Orders
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            📧 A confirmation email will be sent to your registered email address. 
            You can track your order status in the Orders section.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-20 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}