"use server"

import { schemaSignin, schemaSignup } from "@/lib/schema";
import { actionResult } from "@/types";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "../../../../../lib/prisma";


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
            role: 'customer'
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
    throw redirect('/');
}

export async function signUp(
    _:unknown,
    formData:FormData
):Promise<actionResult> {
    const parse = schemaSignup.safeParse({
        name:formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    })
    if (!parse.success) {
        return {
            error: parse.error.issues[0].message
        }
    }

    const hashPassword = bcrypt.hashSync(parse.data.password, 12)

    try{
        await prisma.user.create({
            data: {
                name: parse.data.name,
                email: parse.data.email,
                password: hashPassword,
                role: 'customer'
            }
        })
    }catch(error){
        console.log(error)
        return{
            error:"failed to sign uo"
        }
    }

    return redirect('/sign-in');
}