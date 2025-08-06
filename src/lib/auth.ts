// lib/auth.ts

import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "../../lib/prisma";
import { RoleUser } from "@/generated/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // penting untuk production!
        attributes: {
            // set `secure: true` di production
            secure: process.env.NODE_ENV === "production",
        },
    },
    // Tentukan data user apa saja yang ingin dimasukkan ke objek sesi
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            name: attributes.name,
            email: attributes.email,
            role: attributes.role,
        };
    },
});

// code untuk cek cookies session dan validasi sesi pengguna
export const validateRequest = cache(async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(lucia.sessionCookieName);
    const sessionId = sessionCookie?.value ?? null;

    if (!sessionId) {
        return {
            user: null,
            session: null,
        };
    }

    const result = await lucia.validateSession(sessionId);

    try {
        if (result.session && result.session.fresh) {
            const newSessionCookie = lucia.createSessionCookie(result.session.id);
            cookieStore.set(newSessionCookie.name, newSessionCookie.value, newSessionCookie.attributes);
        }
        if (!result.session) {
            const blankSessionCookie = lucia.createBlankSessionCookie();
            cookieStore.set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);
        }
    } catch { 
        // Jika terjadi error saat mengatur cookie, kita bisa mengabaikannya
        // atau melakukan logging sesuai kebutuhan
        console.error("Error setting session cookie:", result);
    }

    return result;
});

// Penting! Deklarasikan tipe untuk register Lucia
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        userId: string;
        DatabaseUserAttributes: {
            id: string;
            name: string;
            email: string;
            role: RoleUser
        };
    }
}