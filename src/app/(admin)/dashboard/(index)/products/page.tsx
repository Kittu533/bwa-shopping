import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { DataTable } from './_components/data-table';
import { getProducts } from './lib/data';

export default async function ProductPage() {
    const data = await getProducts();

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4 ml-6">Products</h1>
            <DataTable data={data} />
            <Toaster />
        </div>
    );
}
