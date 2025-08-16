"use server";

import { getStoragePathFromUrl, schemaProduct } from "@/lib/schema";
import { uploadFile, supabase } from "@/lib/supabase";
import type { actionResult } from "@/types";
import prisma from "../../../../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import type { ProductStock as ProductStockType } from "@prisma/client";
import z from "zod";

const STORAGE_BUCKET = "belanja";

function asNum(s: string): number {
    const n = Number(s);
    if (!Number.isInteger(n) || n <= 0) {
        throw new Error(`Invalid numeric id: ${s}`);
    }
    return n;
}

function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    try {
        return JSON.stringify(e);
    } catch {
        return String(e);
    }
}

function isFileArray(v: unknown): v is File[] {
    return Array.isArray(v) && v.every((f) => f instanceof File);
}

export async function postProduct(
    _: unknown,
    formData: FormData
): Promise<actionResult> {
    // 1) VALIDASI
    const parsed = schemaProduct.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        categoryId: formData.get("categoryId"),
        brandId: formData.get("brandId"),
        locationId: formData.get("locationId"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        images: formData.getAll("images"),
    });

    if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid product data";
        console.error("[postProduct] ZodError:", parsed.error.flatten());
        return { success: false, error: msg };
    }

    // 2) CAST tipe sesuai schema.prisma
    let brand_id: number;
    let category_id: number;
    let location_id: number;
    let priceBI: bigint;
    let stockEnum: ProductStockType;

    try {
        brand_id = asNum(parsed.data.brandId);
        category_id = asNum(parsed.data.categoryId);
        location_id = asNum(parsed.data.locationId);
        priceBI = BigInt(parsed.data.price); // price: BigInt
        // parsed.data.stock adalah literal union "ready" | "preorder" -> kompatibel dgn ProductStockType
        stockEnum = parsed.data.stock as ProductStockType; // jika TS Anda strict, baris di bawah ini juga valid:
        // stockEnum = parsed.data.stock; // <- biasanya sudah lolos tanpa 'as' pada @prisma/client terbaru
    } catch (e: unknown) {
        const msg = getErrorMessage(e);
        console.error("[postProduct] Cast error:", msg);
        return { success: false, error: msg || "Invalid field value" };
    }

    // 3) UPLOAD gambar dulu
    const imagesUnknown = parsed.data.images;
    if (!isFileArray(imagesUnknown)) {
        return { success: false, error: "Images must be files" };
    }
    const storedPaths: string[] = [];
    try {
        for (const f of imagesUnknown) {
            const p = await uploadFile(f, "products"); // return string path/URL
            storedPaths.push(p);
        }
    } catch (e: unknown) {
        console.error("[postProduct] Upload error:", getErrorMessage(e));
        return { success: false, error: "Image upload failed" };
    }

    // 4) TRANSACTION + CONNECT FK
    try {
        await prisma.$transaction(async (tx) => {
            const [brand, category, location] = await Promise.all([
                tx.brand.findUnique({ where: { id: brand_id } }),
                tx.category.findUnique({ where: { id: category_id } }),
                tx.location.findUnique({ where: { id: location_id } }),
            ]);
            if (!brand) throw new Error(`Brand not found: ${brand_id}`);
            if (!category) throw new Error(`Category not found: ${category_id}`);
            if (!location) throw new Error(`Location not found: ${location_id}`);

            await tx.product.create({
                data: {
                    name: parsed.data.name,
                    description: parsed.data.description,
                    price: priceBI,
                    stock: stockEnum,
                    images: storedPaths,
                    brand: { connect: { id: brand_id } },
                    category: { connect: { id: category_id } },
                    location: { connect: { id: location_id } },
                },
            });
        });

        return { success: true, message: "Product created successfully" };
    } catch (error: unknown) {
        // 5) CLEANUP file jika DB gagal
        console.error("[postProduct] DB error:", getErrorMessage(error));
        try {
            if (storedPaths.length > 0) {
                await supabase.storage.from(STORAGE_BUCKET).remove(storedPaths);
            }
        } catch (rmErr: unknown) {
            console.error("[postProduct] Cleanup storage failed:", getErrorMessage(rmErr));
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                return { success: false, error: "Foreign key constraint failed (brand/category/location)." };
            }
            if (error.code === "P2002") {
                return { success: false, error: "Duplicate value for a unique field." };
            }
            return { success: false, error: `Prisma error ${error.code}` };
        }

        return { success: false, error: getErrorMessage(error) || "Failed to create product" };
    }
}


// update data product
// UPDATE PRODUCT
export async function updateProduct(
    _: unknown,
    formData: FormData,
    id: number | undefined
): Promise<actionResult> {
    if (!id) return { error: "ID tidak ditemukan" };

    // 1) VALIDASI DENGAN SCHEMA UPDATE (images opsional)
    const updateProductSchema = schemaProduct.omit({ images: true }).extend({
        images: z.array(z.instanceof(File)).optional(), // images opsional untuk update
    });

    const parsed = updateProductSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        categoryId: formData.get("categoryId"),
        brandId: formData.get("brandId"),
        locationId: formData.get("locationId"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        images: formData.getAll("images").filter(f => f instanceof File && f.size > 0), // filter file kosong
    });

    if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid product data";
        console.error("[updateProduct] ZodError:", parsed.error.flatten());
        return { success: false, error: msg };
    }

    // 2) AMBIL DATA LAMA
    const oldProduct = await prisma.product.findUnique({ where: { id } });
    if (!oldProduct) return { error: "Product tidak ditemukan" };

    // 3) CAST TIPE
    let brand_id: number;
    let category_id: number;
    let location_id: number;
    let priceBI: bigint;
    let stockEnum: ProductStockType;

    try {
        brand_id = asNum(parsed.data.brandId);
        category_id = asNum(parsed.data.categoryId);
        location_id = asNum(parsed.data.locationId);
        priceBI = BigInt(parsed.data.price);
        stockEnum = parsed.data.stock as ProductStockType;
    } catch (e: unknown) {
        const msg = getErrorMessage(e);
        console.error("[updateProduct] Cast error:", msg);
        return { success: false, error: msg || "Invalid field value" };
    }

    // 4) HANDLE UPLOAD GAMBAR BARU (jika ada)
    const newImagePaths: string[] = [];
    if (parsed.data.images && parsed.data.images.length > 0) {
        try {
            for (const file of parsed.data.images) {
                const path = await uploadFile(file, "products");
                newImagePaths.push(path);
            }
        } catch (e: unknown) {
            console.error("[updateProduct] Upload error:", getErrorMessage(e));
            return { success: false, error: "Image upload failed" };
        }
    }

    // 5) UPDATE TRANSACTION
    try {
        await prisma.$transaction(async (tx) => {
            // Validasi FK
            const [brand, category, location] = await Promise.all([
                tx.brand.findUnique({ where: { id: brand_id } }),
                tx.category.findUnique({ where: { id: category_id } }),
                tx.location.findUnique({ where: { id: location_id } }),
            ]);
            if (!brand) throw new Error(`Brand not found: ${brand_id}`);
            if (!category) throw new Error(`Category not found: ${category_id}`);
            if (!location) throw new Error(`Location not found: ${location_id}`);

            // Tentukan images yang akan disimpan
            const finalImages = newImagePaths.length > 0 ? newImagePaths : oldProduct.images;

            // Update product
            await tx.product.update({
                where: { id },
                data: {
                    name: parsed.data.name,
                    description: parsed.data.description,
                    price: priceBI,
                    stock: stockEnum,
                    images: finalImages,
                    brand: { connect: { id: brand_id } },
                    category: { connect: { id: category_id } },
                    location: { connect: { id: location_id } },
                },
            });

            // Hapus gambar lama jika ada gambar baru
            if (newImagePaths.length > 0 && oldProduct.images.length > 0) {
                const oldPaths = oldProduct.images.map(imagePath => getStoragePathFromUrl(imagePath));
                await supabase.storage.from(STORAGE_BUCKET).remove(oldPaths).catch(err => {
                    console.error("Failed to delete old images:", err);
                });
            }
        });

        return { success: true, message: "Product berhasil diperbarui" };
    } catch (error: unknown) {
        // Cleanup gambar baru jika DB gagal
        if (newImagePaths.length > 0) {
            try {
                await supabase.storage.from(STORAGE_BUCKET).remove(newImagePaths);
            } catch (rmErr: unknown) {
                console.error("[updateProduct] Cleanup storage failed:", getErrorMessage(rmErr));
            }
        }

        console.error("[updateProduct] DB error:", getErrorMessage(error));

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                return { success: false, error: "Foreign key constraint failed (brand/category/location)." };
            }
            if (error.code === "P2002") {
                return { success: false, error: "Duplicate value for a unique field." };
            }
            return { success: false, error: `Prisma error ${error.code}` };
        }

        return { success: false, error: getErrorMessage(error) || "Failed to update product" };
    }
}

// delete data product
// DELETE
export async function deleteProduct(
    _: unknown,
    _formData: FormData,
    id: number
): Promise<actionResult> {
    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return { error: "Product tidak ditemukan" };

        const storedPaths = product.images.map(imagePath => getStoragePathFromUrl(imagePath));
        const { error: storageError } = await supabase.storage
            .from("belanja")
            .remove(storedPaths);

        if (storageError) {
            console.error("storageError:", storageError);
            // opsional: tidak perlu gagalkan delete DB kalau file tidak ada
        }

        await prisma.product.delete({ where: { id } });
        return { success: true, message: "Product berhasil dihapus" };
    } catch (error) {
        console.error("deleteProduct error:", error);
        return { error: "Product gagal dihapus" };
    }
}

export async function getProductById(id: number) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                images: true,
                category_id: true,
                brand_id: true,
                location_id: true,
            },
        });
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}