import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { getOrders } from './lib/data';
import { DataTable } from './_components/data-table';


export default async function orderPage() {
    const data = await getOrders();

    if (data instanceof Response) {
        // Handle error or unexpected response
        throw new Error('Failed to fetch orders');
    }

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4 ml-6">Order Page</h1>
            <DataTable data={data} />
            <Toaster />
        </div>
    );
}
