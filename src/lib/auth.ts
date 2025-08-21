// lib/auth.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "../../lib/prisma";
import { RoleUser } from "@prisma/client";


const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: { secure: process.env.NODE_ENV === "production" },
    },
    getUserAttributes: (attributes) => ({
        id: attributes.id,        // <- ini number
        name: attributes.name,
        email: attributes.email,
        role: attributes.role,
    }),
});

export const validateRequest = cache(async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(lucia.sessionCookieName);
    const sessionId = sessionCookie?.value ?? null;

    if (!sessionId) return { user: null, session: null };

    const result = await lucia.validateSession(sessionId);

    try {
        if (result.session && result.session.fresh) {
            const newSessionCookie = lucia.createSessionCookie(result.session.id);
            cookieStore.set(newSessionCookie.name, newSessionCookie.value, newSessionCookie.attributes);
        }
        if (!result.session) {
            const blank = lucia.createBlankSessionCookie();
            cookieStore.set(blank.name, blank.value, blank.attributes);
        }
    } catch {
        console.error("Error setting session cookie:", result);
    }

    return result;
});

// >>> module augmentation YANG BENAR
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        UserId: number;   // <- wajib: UserId (bukan userId), tipenya number
        DatabaseUserAttributes: {
            id: number;     // <- sesuaikan dengan Prisma: Int
            name: string;
            email: string;
            role: RoleUser;
        };
    }
}
