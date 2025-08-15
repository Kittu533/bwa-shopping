// src/lib/schema.ts
import { file, z } from "zod";

export const MUST_BE_ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
export const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// helper: field name string dengan pola error callback (Zod v4)
const nameString = z
    .string({
        error: (issue) =>
            issue.input === undefined ? "Name is required" : "Name must be a string",
    })
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters long" });

// ================== AUTH ==================
export const schemaSignin = z.object({
    email: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Email is required" : "Email must be a string",
        })
        .trim()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Password is required" : "Password must be a string",
        })
        .min(6, { message: "Password must be at least 6 characters long" }),
});

// ================== MASTER DATA ==================
export const schemaCategory = z.object({
    name: nameString,
});

export const schemaLocation = z.object({
    name: nameString,
});

// ================== FILE SCHEMA (image) ==================
// CREATE: wajib file valid (>0 byte)
const strictFileSchema = z
    .custom<File>((f) => f instanceof File && f.size > 0, { message: "Image is required" })
    .refine((f) => MUST_BE_ALLOWED_IMAGE.includes((f as File).type), {
        message: "FILE IS NOT VALID",
    })
    .refine((f) => (f as File).size <= MAX_SIZE, {
        message: "Max file size is 2MB",
    });

// UPDATE: opsional, tapi bila ada wajib valid
const optionalFileSchema = z
    .custom<File>((f) => f instanceof File && f.size > 0, { message: "Invalid file" })
    .refine((f) => MUST_BE_ALLOWED_IMAGE.includes((f as File).type), {
        message: "FILE IS NOT VALID",
    })
    .refine((f) => (f as File).size <= MAX_SIZE, {
        message: "Max file size is 2MB",
    });

// ================== BRANDS ==================
export const schemaBrand = z.object({
    name: nameString,
    image: strictFileSchema, // CREATE wajib upload file
});

/** Generator skema untuk UPDATE brand.
 *  - requireImage=false => image opsional
 *  - allowUrl=true => image boleh URL selain File
 */
export function brandSchema(opts?: { requireImage?: boolean; allowUrl?: boolean }) {
    const { requireImage = true, allowUrl = false } = opts ?? {};
    const base = allowUrl
        ? z.union([optionalFileSchema, z.string().url({ message: "Invalid image URL" })])
        : optionalFileSchema;

    return z.object({
        name: nameString,
        image: requireImage ? base : base.optional(),
    });
}

// ================== UTIL UNTUK ACTIONS ==================
/** Normalisasi input dari FormData: file kosong -> undefined; string kosong -> undefined */
export function normalizeImageInput(raw: FormDataEntryValue | null | undefined) {
    if (raw instanceof File) return raw.size > 0 ? raw : undefined;
    if (typeof raw === "string") {
        const s = raw.trim();
        return s.length ? s : undefined;
    }
    return undefined;
}

/** Ambil path "brands/xxx" dari URL publik Supabase atau path langsung */
export function getStoragePathFromUrl(urlOrPath: string) {
    if (!urlOrPath.startsWith("http")) {
        return urlOrPath.startsWith("brands/") ? urlOrPath : `brands/${urlOrPath}`;
    }
    try {
        const u = new URL(urlOrPath);
        const parts = u.pathname.split("/");
        const publicIdx = parts.findIndex((p) => p === "public");
        if (publicIdx >= 0 && parts.length > publicIdx + 2) {
            return parts.slice(publicIdx + 2).join("/"); // "<path-dlm-bucket>"
        }
    } catch { }
    return urlOrPath.startsWith("brands/") ? urlOrPath : `brands/${urlOrPath}`;
}


// --- schema for products ---
const numericIdString = z
    .string({
        error: (issue) =>
            issue.input === undefined ? "ID is required" : "ID must be a string",
    })
    .trim()
    .regex(/^\d+$/, { message: "ID must be a positive integer string" });

const priceStringAsBigInt = z
    .string({
        error: (issue) =>
            issue.input === undefined ? "Price is required" : "Price must be a string",
    })
    .trim()
    .regex(/^\d+$/, { message: "Price must be an integer number" }); // BigInt butuh bilangan bulat

const stockEnumString = z.enum(["ready", "preorder"]).or(
    z.string().refine(() => false, {
        message: "Stock must be 'ready' or 'preorder'",
    })
);
// Validasi array file: tepat 3, type & size sesuai
const productImagesSchema = z
    .any()
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .refine((arr: unknown[]) => arr.every((f) => f instanceof File), {
        message: "Images must be files",
    })
    .refine((arr: File[]) => arr.length === 3, {
        message: "Exactly 3 images are required",
    })
    .refine(
        (arr: File[]) => arr.every((f) => MUST_BE_ALLOWED_IMAGE.includes(f.type)),
        { message: "All images must be JPEG/PNG/WEBP" }
    )
    .refine((arr: File[]) => arr.every((f) => f.size <= MAX_SIZE), {
        message: "Each image must be at most 2MB",
    });

export const schemaProduct = z.object({
    name: nameString,
    description: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Description is required" : "Description must be a string",
        })
        .trim()
        .max(500, { message: "Description must be at most 500 characters long" }),

    // FormData kirim string → validasi sebagai string numerik
    categoryId: numericIdString,
    brandId: numericIdString,
    locationId: numericIdString,

    price: priceStringAsBigInt,     // akan di-convert ke BigInt di action
    stock: stockEnumString,         // 'ready' | 'preorder'

    images: productImagesSchema,    // tepat 3 file valid
});
