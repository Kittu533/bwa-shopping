"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductFormData } from "./product-form"


interface ProductBasicInfoProps {
    formData: ProductFormData
    updateFormData: (updates: Partial<ProductFormData>) => void
}

export function ProductBasicInfo({ formData, updateFormData }: ProductBasicInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                        id="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your product in detail..."
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        rows={4}
                        required
                    />
                </div>
            </CardContent>
        </Card>
    )
}
