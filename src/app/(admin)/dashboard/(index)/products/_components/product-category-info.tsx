"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductFormData } from "./product-form"

interface ProductCategoryInfoProps {
    formData: ProductFormData
    updateFormData: (updates: Partial<ProductFormData>) => void
    categories: Array<{ id: number; name: string }>
    brands: Array<{ id: number; name: string; logo: string }>
    locations: Array<{ id: number; name: string }>
}

export function ProductCategoryInfo({
    formData, updateFormData, categories, locations, brands
}: ProductCategoryInfoProps) {
    // helper: pastikan value saat ini ada di options
    const ensureOption = <T extends { id: number; name: string }>(
        list: T[], currentIdStr: string
    ) => {
        if (!currentIdStr) return list;
        const found = list.some(i => String(i.id) === currentIdStr);
        if (found) return list;
        // injeksi item dummy agar Select bisa menampilkan value saat ini
        const currentIdNum = Number(currentIdStr);
        return [
            { id: currentIdNum, name: "(current value - not in list)" } as T,
            ...list
        ];
    };

    const catOptions = ensureOption(categories, formData.categoryId);
    const brandOptions = ensureOption(brands, formData.brandId);
    const locOptions = ensureOption(locations, formData.locationId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Category & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category *</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) => updateFormData({ categoryId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {catOptions.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand_id">Brand *</Label>
                        <Select
                            value={formData.brandId}
                            onValueChange={(value) => updateFormData({ brandId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brandOptions.map((brand) => (
                                    <SelectItem key={brand.id} value={String(brand.id)}>
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="location_id">Location *</Label>
                        <Select
                            value={formData.locationId}
                            onValueChange={(value) => updateFormData({ locationId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locOptions.map((location) => (
                                    <SelectItem key={location.id} value={String(location.id)}>
                                        {location.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: "ACTIVE" | "INACTIVE" | "DRAFT") => updateFormData({ status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
