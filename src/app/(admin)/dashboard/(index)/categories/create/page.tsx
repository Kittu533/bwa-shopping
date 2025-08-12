'use client'

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReusableDialog } from "../../_components/ReusableDialog"

export default function CreateCategoryPage() {
    return (
        <main className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Tambah Kategori</h1>
            <ReusableDialog
                triggerLabel="Buka Form"
                title="Tambah Kategori"
                description="Isi data kategori baru di bawah ini."
                submitLabel="Simpan"
                cancelLabel="Batal"
                onSubmit={(e) => {
                    e.preventDefault()
                    // handle submit
                }}
            >
                <div className="grid gap-3">
                    <Label htmlFor="category-name">Nama Kategori</Label>
                    <Input id="category-name" name="name" />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="category-desc">Deskripsi</Label>
                    <Input id="category-desc" name="desc" />
                </div>
            </ReusableDialog>
        </main>
    )
}