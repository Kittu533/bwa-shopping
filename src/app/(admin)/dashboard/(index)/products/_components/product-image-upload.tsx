"use client"

import type React from "react"

import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Upload, ImageIcon } from "lucide-react"
import { ProductFormData } from "./product-form"
import Image from "next/image"


interface ProductImageUploadProps {
  formData: ProductFormData
  updateFormData: (updates: Partial<ProductFormData>) => void
}

export function ProductImageUpload({ formData, updateFormData }: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = [...formData.images, ...files].slice(0, 10) // Limit to 10 images
    updateFormData({ images: newImages })
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    updateFormData({ images: newImages })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <p className="text-sm text-muted-foreground">Upload at MAX 3 images  allowed.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {formData.images.length > 0 && (
          <div className="grid gap-4 grid-cols-5">
            {formData.images.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg border-2 border-dashed border-border overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            {formData.images.length === 0 ? (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {formData.images.length === 0 ? "Upload product images" : "Add more images"}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB each</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {formData.images.length}/10 images uploaded
          {formData.images.length < 3 && <span className="text-destructive ml-1">(Minimum 3 required)</span>}
        </div>
      </CardContent>
    </Card>
  )
}
