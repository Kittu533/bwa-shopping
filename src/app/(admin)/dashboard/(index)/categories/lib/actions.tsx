'use server'

import { schemaCategory } from "@/lib/schema";
import { actionResult } from "@/types";
import prisma from "../../../../../../../lib/prisma";

export async function postCategory(
    _: unknown,
    formData: FormData,
): Promise<actionResult> {

    const validate = schemaCategory.safeParse({
        name: formData.get('name'),
    })
    if (!validate.success) {
        return {
            error: validate.error.issues[0].message
        }
    }

    // Simulasi tambah data ke database di sini
    // Misal: await db.category.create({ data: { name: formData.get('name') } })
    try {
        await prisma.category.create({
            data: {
                name: validate.data.name
            }
        });
        return {
            success: true,
            message: "Kategori berhasil ditambahkan"
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Kategori gagal ditambahkan"
        };
    }

}

// handleEditSubmit Kategori disini
export async function updateCategory(
    _: unknown,
    formData: FormData,
    id: number | undefined
): Promise<actionResult> {
    const validate = schemaCategory.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
    })
    if (!validate.success) {
        return {
            error: validate.error.issues[0].message
        }
    }

    try {
        await prisma.category.update({
            where: {
                id: id
            },
            data: {
                name: validate.data.name
            }
        });
        return {
            success: true,
            message: "Kategori berhasil diubah"
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Kategori gagal diubah"
        };
    }
}

// handle delete kategori
export async function deleteCategory(
    _: unknown,
    formData: FormData,
    id: number
): Promise<actionResult> {
    try {
        await prisma.category.delete({
            where: {
                id
            }
        });
        return {
            success: true,
            message: "Kategori berhasil dihapus"
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Kategori gagal dihapus"
        };
    }
}