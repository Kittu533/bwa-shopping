"use server"

import { schemaSignin } from "@/lib/schema";
import { actionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../../lib/prisma";
import bcrypt from "bcrypt";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";


export async function signIn(
    prevState: actionResult,
    formData: FormData
): Promise<actionResult> {

    const validate = schemaSignin.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })
    if (!validate.success) {
        return {
            error: validate.error.issues[0].message
        }
    }

    // 
    const existingUser = await prisma.user.findFirst({
        where: {
            email: validate.data.email,
            role: 'superadmin'
        }
    })

    if (!existingUser) {
        return {
            error: "email not found"
        }
    }

    const comparePassword = bcrypt.compareSync(validate.data.password, existingUser.password)

    if (!comparePassword) {
        return {
            error: "invalid password"
        }
    }


    // membuat session dan cookie
    // create session
    const session = await lucia.createSession(existingUser.id, {})
    // create cookie
    const sessionCookie = lucia.createSessionCookie(session.id)
        ; (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )
    throw redirect('/dashboard');
}