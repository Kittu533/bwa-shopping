import React from 'react'
import { DataTable } from './_components/data-table'
import { getCategories } from './lib/data'
import { Toaster } from '@/components/ui/sonner'

export default async function CategoriesPage() {

    const data = await getCategories();

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4 ml-6">Categories</h1>
            <DataTable data={data} />
            <Toaster />
        </div>
    )
}
