"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductFormData } from "./product-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface ProductPriceStockProps {
    formData: ProductFormData
    updateFormData: (updates: Partial<ProductFormData>) => void
}

export function ProductPriceStock({ formData, updateFormData }: ProductPriceStockProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => updateFormData({ price: e.target.value })}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock Status *</Label>
                        <Select
                            value={formData.stock}
                            onValueChange={(value: "ready" | "preorder") => updateFormData({ stock: value })}
                        >
                            <SelectTrigger id="stock">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="preorder">Preorder</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
