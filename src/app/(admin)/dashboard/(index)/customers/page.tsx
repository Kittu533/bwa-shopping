import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { DataTable } from './_components/data-table';
import { getCustomers } from './lib/data';


export default async function CustomerPage() {
    let data = await getCustomers();
    // If getCustomers returns a Response, parse it as JSON
    if (data instanceof Response) {
        data = await data.json();
    }

    // Ensure data is an array, otherwise fallback to empty array
    const customers: { id: number; name: string; email: string; totalTransaction: number; }[] =
        Array.isArray(data) ? data : [];

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4 ml-6">Customers</h1>
            <DataTable data={customers} />
            <Toaster />
        </div>
    );
}
