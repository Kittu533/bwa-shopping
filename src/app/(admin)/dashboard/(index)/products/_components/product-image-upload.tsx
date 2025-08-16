"use client"

import type React from "react"

import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Upload, ImageIcon } from "lucide-react"
import { ProductFormData } from "./product-form"
import Image from "next/image"
import { getImageUrl } from "@/lib/supabase"

interface ProductImageUploadProps {
  formData: ProductFormData
  updateFormData: (updates: Partial<ProductFormData>) => void
  existingImages?: string[] // array of image URLs untuk mode edit
}

export function ProductImageUpload({
  formData,
  updateFormData,
  existingImages
}: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = [...formData.images, ...files].slice(0, 3) // Limit to 3 images
    updateFormData({ images: newImages })
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    updateFormData({ images: newImages })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Untuk mode edit, cek apakah ada gambar existing
  const hasExistingImages = existingImages && existingImages.length > 0
  const hasNewImages = formData.images.length > 0
  const totalImageCount = (existingImages?.length || 0) + formData.images.length
  const isEditMode = !!existingImages

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? "Upload new images to replace existing ones (optional)"
            : "Upload exactly 3 images required"
          }
        </p>
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

        {/* Preview Existing Images (untuk mode edit) */}
        {hasExistingImages && !hasNewImages && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Current Images:</p>
            <div className="grid gap-4 grid-cols-3">
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border overflow-hidden">
                    <Image
                      src={getImageUrl(imageUrl, 'products')}
                      alt={`Existing image ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                    Current
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview New Images */}
        {hasNewImages && (
          <div className="space-y-2">
            {hasExistingImages && (
              <p className="text-sm font-medium text-muted-foreground">New Images (will replace current):</p>
            )}
            <div className="grid gap-4 grid-cols-3">
              {formData.images.map((file, index) => (
                <div key={`new-${index}`} className="relative group">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border overflow-hidden">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`New image ${index + 1}`}
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
                  {hasExistingImages && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                      New
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            {!hasNewImages && !hasExistingImages ? (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isEditMode
                  ? (hasNewImages ? "Replace with different images" : "Upload new images")
                  : (formData.images.length === 0 ? "Upload product images" : "Add more images")
                }
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 2MB each</p>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="text-xs text-muted-foreground">
          {isEditMode ? (
            hasNewImages ? (
              <span>
                {formData.images.length}/3 new images selected
                {formData.images.length < 3 && <span className="text-destructive ml-1">(Upload exactly 3)</span>}
              </span>
            ) : (
              <span className="text-green-600">
                Using {existingImages.length} existing images (upload new ones to replace)
              </span>
            )
          ) : (
            <span>
              {formData.images.length}/3 images uploaded
              {formData.images.length < 3 && <span className="text-destructive ml-1">(Exactly 3 required)</span>}
            </span>
          )}
        </div>

        {/* Warning for edit mode */}
        {isEditMode && hasNewImages && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ Uploading new images will replace all existing images. Make sure to upload exactly 3 images.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}