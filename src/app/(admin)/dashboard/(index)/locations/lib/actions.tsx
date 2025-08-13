'use server'

import { schemaLocation } from "@/lib/schema";
import { actionResult } from "@/types";
import prisma from "../../../../../../../lib/prisma";

export async function postLocation(
    _: unknown,
    formData: FormData,
): Promise<actionResult> {

    const validate = schemaLocation.safeParse({
        name: formData.get('name'),
    })
    if (!validate.success) {
        return {
            error: validate.error.issues[0].message
        }
    }

    try {
        await prisma.location.create({
            data: {
                name: validate.data.name
            }
        });
        return {
            success: true,
            message: "Lokasi berhasil ditambahkan"
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Lokasi gagal ditambahkan"
        };
    }

}

export async function updateLocation(
    _: unknown,
    formData: FormData,
    id: number | undefined
): Promise<actionResult> {
    const validate = schemaLocation.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
    })
    if (!validate.success) {
        return {
            error: validate.error.issues[0].message
        }
    }

    try {
        await prisma.location.update({
            where: {
                id: id
            },
            data: {
                name: validate.data.name
            }
        });
        return {
            success: true,
            message: "Lokasi berhasil diubah"
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Lokasi gagal diubah"
        };
    }
}

export async function deleteLocation(
    _: unknown,
    formData: FormData,
    id: number
): Promise<actionResult> {
    try {
        await prisma.location.delete({
            where: {
                id
            }
        });
        return {
            success: true,
            message: "Lokasi berhasil dihapus"
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Lokasi gagal dihapus"
        };
    }
}
