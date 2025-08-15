"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductCategoryInfo } from "./product-category-info";
import { ProductPriceStock } from "./product-price-stock";
import { ProductImageUpload } from "./product-image-upload";
import { postProduct } from "../lib/actions";

// 👉 IMPORT server action


export interface ProductFormData {
    name: string;
    description: string;
    categoryId: string; // string numerik (id)
    brandId: string;    // string numerik (id)
    locationId: string; // string numerik (id)
    status: "ACTIVE" | "INACTIVE" | "DRAFT"; // (kalau belum dipakai, biarkan)
    price: string;      // string angka bulat (akan jadi BigInt di server)
    stock: "ready" | "preorder" ; // tambahkan "pre-order" jika perlu

    images: File[];     // harus 3 file
}

export function CreateProductForm({
    categories,
    brands,
    locations,
}: {
    categories: Array<{ id: number; name: string }>;
    brands: Array<{ id: number; name: string; logo: string }>;
    locations: Array<{ id: number; name: string }>;
}) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        categoryId: "",
        brandId: "",
        locationId: "",
        status: "DRAFT",
        price: "",
        stock: "ready", // default enum valid
        images: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pending, startTransition] = useTransition();

    const updateFormData = (updates: Partial<ProductFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- Client-side guard (UX) ---
        if (formData.images.length !== 3) {
            alert("Masukkan tepat 3 gambar (JPEG/PNG/WEBP, maks 2MB).");
            return;
        }
        if (!/^\d+$/.test(formData.price)) {
            alert("Harga harus berupa bilangan bulat (tanpa titik/koma).");
            return;
        }

        setIsSubmitting(true);
        // Susun FormData untuk server action
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description);
        fd.append("categoryId", String(formData.categoryId)); // string numerik
        fd.append("brandId", String(formData.brandId));
        fd.append("locationId", String(formData.locationId));
        fd.append("price", formData.price);      // server akan BigInt(...)
        fd.append("stock", formData.stock);      // "ready" | "preorder"

        // append 3 file dengan key "images"
        for (const f of formData.images) {
            if (f) fd.append("images", f, f.name);
        }

        try {
            // Bisa dipanggil langsung (Next server actions)
            const result = await postProduct(null, fd);

            // Jika action melakukan redirect(), browser akan langsung pindah.
            // Kalau tidak redirect, tangani hasilnya di sini:
            if (result?.error) {
                alert(result.error);
            } else if (result?.success) {
                alert("Product created successfully!");
                // Reset (opsional)
                setFormData((prev) => ({
                    ...prev,
                    name: "",
                    description: "",
                    categoryId: "",
                    brandId: "",
                    locationId: "",
                    price: "",
                    stock: "ready",
                    images: [],
                    status: "DRAFT",
                }));
            }
        } catch (err) {
            console.error("Client call postProduct failed:", err);
            alert("Terjadi kesalahan saat membuat produk.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <ProductBasicInfo formData={formData} updateFormData={updateFormData} />
                    <ProductCategoryInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        categories={categories}
                        brands={brands}
                        locations={locations}
                    />
                </div>

                <div className="space-y-6 flex flex-col justify-arround">
                    <ProductImageUpload formData={formData} updateFormData={updateFormData} />
                    <ProductPriceStock formData={formData} updateFormData={updateFormData} />
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 justify-end">
                        <Button type="button" variant="outline">
                            Save as Draft
                        </Button>
                        <Button type="submit" disabled={isSubmitting || pending}>
                            {isSubmitting || pending ? "Creating Product..." : "Create Product"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
