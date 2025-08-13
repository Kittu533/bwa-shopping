import React from 'react'
import { Toaster } from '@/components/ui/sonner'
import { DataTable } from './_components/data-table';
import { getLocations } from './lib/data';

export default async function LocationsPage() {

    const data = await getLocations();

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4 ml-6">Locations</h1>
            <DataTable data={data} />
            <Toaster />
        </div>
    )
}
