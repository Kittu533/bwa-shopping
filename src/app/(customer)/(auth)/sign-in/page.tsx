"use client";

import { actionResult } from "@/types";
import Image from "next/image";
import React, { useActionState, useEffect, useState } from "react";

import { signIn } from "../lib/actions";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import Link from "next/link";

const initialFormState: actionResult = {
  error: "",
};

// hooks submit button
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="p-[12px_24px] bg-[#0D5CD7] rounded-full text-center font-semibold text-white"
    >
      {pending ? "loading..." : "Sign In to My Account"}
    </button>
  );
}

export default function SigninPage() {
  const [state, formAction] = useActionState(signIn, initialFormState);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!hasSubmitted) return;
    if (state?.error) {
      toast.error(state.error);
    } else if (state && !state.error) {
      toast.success("Sign up successful!");
    }
  }, [state, hasSubmitted]);

  return (
    <div
      id="signin"
      className="bg-[#EFF3FA] min-h-screen pt-[30px] pb-[50px] flex flex-col"
    >
      <div className="container max-w-[1130px] mx-auto flex flex-1 items-center justify-center py-5">
        <form
          action={async (formData) => {
            setHasSubmitted(true);
            await formAction(formData);
          }}
          className="w-[500px] bg-white p-[50px_30px] flex flex-col gap-5 rounded-3xl border border-[#E5E5E5]"
        >
          <div className="flex justify-center">
            <Image
              width={200}
              height={200}
              src="/assets/logos/logo-black.svg"
              alt="logo"
            />
          </div>
          <h1 className="font-bold text-2xl text-black leading-[34px]">
            Sign In
          </h1>

          {state.error !== "" && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm">
              {state.error}
            </div>
          )}

          <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
            <div className="flex shrink-0">
              <Image
                width={24}
                height={24}
                src="/assets/icons/sms.svg"
                alt="icon"
              />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
              placeholder="Write your email address"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
              <div className="flex shrink-0">
                <Image
                  width={24}
                  height={24}
                  src="/assets/icons/lock.svg"
                  alt="icon"
                />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
                placeholder="Write your password"
              />
              {/* <button type="button" className="reveal-password flex shrink-0">
                <Image
                  width={24}
                  height={24}
                  src="/assets/icons/eye.svg"
                  alt="icon"
                />
              </button> */}
            </div>
            {/* <a
              href=""
              className="text-sm text-[#616369] underline w-fit mr-0 ml-auto"
            >
              Forgot Password
            </a> */}
          </div>
          <div className="flex flex-col gap-3">
            <SubmitButton />
            <Link
              href="sign-up"
              className="p-[12px_24px] text-black bg-white rounded-full text-center font-semibold border border-[#E5E5E5]"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
