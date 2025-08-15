// src/app/(admin)/dashboard/(index)/brands/lib/actions.ts
"use server";

import { actionResult } from "@/types";
import prisma from "../../../../../../../lib/prisma";
import {
    schemaBrand,
    brandSchema,
    normalizeImageInput,
    getStoragePathFromUrl,
} from "@/lib/schema";
import { supabase, uploadFile } from "@/lib/supabase";

// CREATE
export async function postBrand(_: unknown, formData: FormData): Promise<actionResult> {
    try {
        const parsed = schemaBrand.safeParse({
            name: formData.get("name"),
            image: formData.get("image"), // wajib file valid
        });
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
        }

        const file = parsed.data.image as File;
        const storedPathOrUrl = await uploadFile(file, "brands");

        await prisma.brand.create({
            data: { name: parsed.data.name, logo: storedPathOrUrl },
        });

        return { success: true, message: "Brand berhasil ditambahkan" };
    } catch (err) {
        console.error("postBrand error:", err);
        return { error: "Brand gagal ditambahkan" };
    }
}

// UPDATE
export async function updateBrand(
    _: unknown,
    formData: FormData,
    id: number | undefined
): Promise<actionResult> {
    if (!id) return { error: "ID TIDAK DITEMUKAN" };

    const oldBrand = await prisma.brand.findUnique({ where: { id } });
    if (!oldBrand) return { error: "BRAND TIDAK DITEMUKAN" };

    const image = normalizeImageInput(formData.get("image"));
    const updateBrandSchema = brandSchema({ requireImage: false, allowUrl: true });

    const validate = updateBrandSchema.safeParse({
        name: formData.get("name"),
        image, // sudah dinormalisasi
    });
    if (!validate.success) {
        return { error: validate.error.issues[0]?.message ?? "Invalid input" };
    }

    const { name } = validate.data;
    let logoUrl = oldBrand.logo;

    if (image instanceof File) {
        // hapus lama
        const oldPath = getStoragePathFromUrl(oldBrand.logo);
        if (oldPath) {
            await supabase.storage.from("belanja").remove([oldPath]).catch(() => { });
        }
        // upload baru
        logoUrl = await uploadFile(image, "brands");
    } else if (typeof image === "string") {
        // user memasukkan URL
        logoUrl = image;
    }
    // image undefined => pakai logo lama

    try {
        await prisma.brand.update({
            where: { id },
            data: { name, logo: logoUrl },
        });
        return { success: true, message: "Brand berhasil diperbarui" };
    } catch (error) {
        console.error("updateBrand error:", error);
        return { error: "Brand gagal diperbarui" };
    }
}

// DELETE
export async function deleteBrand(
    _: unknown,
    _formData: FormData,
    id: number
): Promise<actionResult> {
    try {
        const brand = await prisma.brand.findUnique({ where: { id } });
        if (!brand) return { error: "Brand tidak ditemukan" };

        const logoPath = getStoragePathFromUrl(brand.logo);
        const { error: storageError } = await supabase.storage
            .from("belanja")
            .remove([logoPath]);

        if (storageError) {
            console.error("storageError:", storageError);
            // opsional: tidak perlu gagalkan delete DB kalau file tidak ada
        }

        await prisma.brand.delete({ where: { id } });
        return { success: true, message: "Brand berhasil dihapus" };
    } catch (error) {
        console.error("deleteBrand error:", error);
        return { error: "Brand gagal dihapus" };
    }
}