"use server"

import { lucia, validateRequest } from "@/lib/auth";
import { actionResult } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Logout(
    _: unknown,
    formData: FormData,
): Promise<actionResult> {
    console.log('logout'); 'logout'

    const { session } = await validateRequest();

    if (!session) {
        return {
            error: 'Unauthorized',
        };
    }
    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie()
        ; (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

    return redirect('/dashboard/signin');
}