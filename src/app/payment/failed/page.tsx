import { Suspense } from 'react';
import Link from 'next/link';

interface SearchParams {
  order_code?: string;
}

function FailedContent({ searchParams }: { searchParams: SearchParams }) {
  const orderCode = searchParams.order_code;

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 text-center">
        {/* Failed Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Failed
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Unfortunately, your payment could not be processed.
        </p>

        {orderCode && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Code: <span className="font-semibold">{orderCode}</span></p>
          </div>
        )}

        <div className="bg-red-50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-red-800 mb-2">Possible reasons:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Insufficient balance in your e-wallet</li>
            <li>• Network connection issues</li>
            <li>• Payment method temporarily unavailable</li>
            <li>• Transaction timeout</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link 
            href="/carts"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </Link>
          <Link 
            href="/"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 If you continue to experience issues, please contact our customer support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage({
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
      <FailedContent searchParams={searchParams} />
    </Suspense>
  );
}