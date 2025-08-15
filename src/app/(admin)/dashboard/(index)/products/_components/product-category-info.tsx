"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductFormData } from "./product-form"


interface ProductCategoryInfoProps {
    formData: ProductFormData
    updateFormData: (updates: Partial<ProductFormData>) => void
    categories: Array<{ id: number; name: string }>
    brands: Array<{ id: number; name: string, logo: string }>
    locations: Array<{ id: number; name: string }>
}


export function ProductCategoryInfo({ formData, updateFormData, categories, locations, brands }: ProductCategoryInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Category & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category *</Label>
                        <Select value={formData.categoryId} onValueChange={(value) => updateFormData({ categoryId: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand_id">Brand *</Label>
                        <Select value={formData.brandId} onValueChange={(value) => updateFormData({ brandId: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.id.toString()}>
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
                        <Select value={formData.locationId} onValueChange={(value) => updateFormData({ locationId: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((location) => (
                                    <SelectItem key={location.id} value={location.id.toString()}>
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
                                <SelectValue />
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
    )
}
