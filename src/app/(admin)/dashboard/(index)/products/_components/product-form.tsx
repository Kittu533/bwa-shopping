"use client";

import * as React from "react";
import { useState, useTransition, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductCategoryInfo } from "./product-category-info";
import { ProductPriceStock } from "./product-price-stock";
import { ProductImageUpload } from "./product-image-upload";
import { postProduct, updateProduct } from "../lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface ProductFormData {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    locationId: string;
    status: "ACTIVE" | "INACTIVE" | "DRAFT";
    price: string;
    stock: "ready" | "preorder";
    images: File[];
}

// Type untuk data product yang sudah ada (untuk edit)
export interface ExistingProductData {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    brandId: number;
    locationId: number;
    price: number;
    stock: string;
    images: string[]; // array of image URLs
}

interface ProductFormProps {
    categories: Array<{ id: number; name: string }>;
    brands: Array<{ id: number; name: string; logo: string }>;
    locations: Array<{ id: number; name: string }>;
    mode: "create" | "edit";
    initialData?: ExistingProductData; // untuk mode edit
}

export function ProductForm({
    categories,
    brands,
    locations,
    mode,
    initialData,
}: ProductFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        categoryId: "",
        brandId: "",
        locationId: "",
        status: "DRAFT",
        price: "",
        stock: "ready",
        images: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pending, startTransition] = useTransition();

    // Populate form dengan data existing untuk mode edit
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                categoryId: String(initialData.categoryId),
                brandId: String(initialData.brandId),
                locationId: String(initialData.locationId),
                status: "ACTIVE", // atau sesuai data
                price: String(initialData.price),
                stock: initialData.stock as "ready" | "preorder",
                images: [], // images kosong untuk edit (kecuali user upload baru)
            });
        }
    }, [mode, initialData]);

    const updateFormData = (updates: Partial<ProductFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi berbeda untuk create vs edit
        if (mode === "create") {
            if (formData.images.length !== 3) {
                toast.error("Masukkan tepat 3 gambar (JPEG/PNG/WEBP, maks 2MB).");
                return;
            }
        }
        // Untuk edit, images boleh kosong (pakai gambar lama)

        if (!/^\d+$/.test(formData.price)) {
            toast.error("Harga harus berupa bilangan bulat (tanpa titik/koma).");
            return;
        }

        setIsSubmitting(true);

        // Susun FormData
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description);
        fd.append("categoryId", String(formData.categoryId));
        fd.append("brandId", String(formData.brandId));
        fd.append("locationId", String(formData.locationId));
        fd.append("price", formData.price);
        fd.append("stock", formData.stock);

        // Append images (jika ada)
        for (const f of formData.images) {
            if (f) fd.append("images", f, f.name);
        }

        try {
            let result;

            if (mode === "create") {
                result = await postProduct(null, fd);
            } else {
                // Mode edit
                if (!initialData?.id) {
                    toast.error("ID product tidak ditemukan");
                    return;
                }
                result = await updateProduct(null, fd, initialData.id);
            }

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                const message = mode === "create"
                    ? "Product berhasil dibuat!"
                    : "Product berhasil diperbarui!";
                toast.success(message);

                // Redirect ke halaman products
                router.push("/dashboard/products");
            }
        } catch (err) {
            console.error(`${mode} product failed:`, err);
            toast.error(`Terjadi kesalahan saat ${mode === "create" ? "membuat" : "memperbarui"} produk.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEdit = mode === "edit";
    const submitButtonText = isSubmitting || pending
        ? (isEdit ? "Updating Product..." : "Creating Product...")
        : (isEdit ? "Update Product" : "Create Product");

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

                <div className="space-y-6 flex flex-col justify-around">
                    <ProductImageUpload
                        formData={formData}
                        updateFormData={updateFormData}
                        existingImages={isEdit ? initialData?.images : undefined}
                    />
                    <ProductPriceStock formData={formData} updateFormData={updateFormData} />
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || pending}>
                            {submitButtonText}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

// Wrapper untuk CREATE
export function CreateProductForm(props: Omit<ProductFormProps, "mode">) {
    return <ProductForm {...props} mode="create" />;
}

// Wrapper untuk EDIT
export function EditProductForm(props: Omit<ProductFormProps, "mode"> & { initialData: ExistingProductData }) {
    return <ProductForm {...props} mode="edit" />;
}