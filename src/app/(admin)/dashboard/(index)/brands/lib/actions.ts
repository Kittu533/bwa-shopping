'use server';

import { actionResult } from "@/types";
import prisma from "../../../../../../../lib/prisma";
import { schemaBrand } from "@/lib/schema";
import { uploadFile } from "@/lib/supabase";

// export const runtime = 'nodejs'; // paksa Node runtime (bukan Edge)

export async function postBrand(_: unknown, formData: FormData) {
    try {
        const parsed = schemaBrand.safeParse({
            name: formData.get('name'),
            image: formData.get('image'),
        });
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
        }

        const file = parsed.data.image as File;
        const filename = await uploadFile(file, 'brands');

        await prisma.brand.create({
            data: { name: parsed.data.name, logo: filename },
        });

        return { success: true, message: 'Brand berhasil ditambahkan' };
    } catch (err) {
        console.error('postBrand error:', err);
        return { error: 'Brand gagal ditambahkan' };
    }
}

// handleEditSubmit Brand disini
// export async function updateBrand(
//     _: unknown,
//     formData: FormData,
//     id: number | undefined
// ): Promise<actionResult> {
//     const validate = schemaBrand.safeParse({
//         id: formData.get('id'),
//         name: formData.get('name'),
//         logo: formData.get('logo'),
//     });
//     if (!validate.success) {
//         return {
//             error: validate.error.issues[0].message
//         };
//     }

//     try {
//         await prisma.brand.update({
//             where: {
//                 id: id
//             },
//             data: {
//                 name: validate.data.name
//             }
//         });
//         return {
//             success: true,
//             message: "Brand berhasil diubah"
//         };
//     } catch (error) {
//         console.log(error);
//         return {
//             error: "Brand gagal diubah"
//         };
//     }
// }

// // handle delete brand
// export async function deleteBrand(
//     _: unknown,
//     formData: FormData,
//     id: number
// ): Promise<actionResult> {
//     try {
//         await prisma.brand.delete({
//             where: {
//                 id
//             }
//         });
//         return {
//             success: true,
//             message: "Brand berhasil dihapus"
//         };
//     } catch (error) {
//         console.log(error);
//         return {
//             error: "Brand gagal dihapus"
//         };
//     }
// }
