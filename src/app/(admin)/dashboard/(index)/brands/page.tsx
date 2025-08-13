import React from 'react'
import { Toaster } from '@/components/ui/sonner'
import { getBrands } from './lib/data';
import { DataTable } from './_components/data-table';

export default async function BrandsPage() {

    const data = await getBrands();

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4 ml-6">Brand</h1>
            <DataTable data={data} />
            <Toaster />
        </div>
    )
}
