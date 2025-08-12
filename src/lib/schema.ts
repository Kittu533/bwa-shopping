import { z } from "zod";

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