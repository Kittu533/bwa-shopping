import { file, z } from "zod";

export const MUST_BE_ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;

// schema signin must be
export const schemaSignin = z.object({
    email: z
        .string({
            // kalau undefined → required; kalau tipe salah → not a string
            error: (issue) =>
                issue.input === undefined
                    ? "Email is required"
                    : "Email must be a string",
        })
        .trim()
        .min(1, { error: "Email is required" }) // tangani empty string ""
        .email({ error: "Invalid email address" }),

    password: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Password is required"
                    : "Password must be a string",
        })
        .min(6, { error: "Password must be at least 6 characters long" }),
});

// schema Category prisma
export const schemaCategory = z.object({
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Name is required"
                    : "Name must be a string",
        })
        .trim()
        .min(1, { error: "Name is required" }) // tangani empty string ""
        .max(50, { error: "Name must be at most 50 characters long" }),
})

// schema location prisma 
export const schemaLocation = z.object({
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Name is required"
                    : "Name must be a string",
        })
        .trim()
        .min(1, { error: "Name is required" }) // tangani empty string ""
        .max(50, { error: "Name must be at most 50 characters long" }),
})

// schema brands prisma

export const schemaBrand = z.object({
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Name is required"
                    : "Name must be a string",
        })
        .trim()
        .min(1, { error: "Name is required" }) // tangani empty string ""
        .max(50, { error: "Name must be at most 50 characters long" }),

    // validasi gambar untuk brands
    image: z.any()
        .refine((f) => f instanceof File, { message: 'Image is required' })
        .refine((f) => MUST_BE_ALLOWED_IMAGE.includes((f as File).type), { message: 'FILE IS NOT VALID' })
        .refine((f) => (f as File).size <= MAX_SIZE, { message: 'Max file size is 2MB' }),
});
