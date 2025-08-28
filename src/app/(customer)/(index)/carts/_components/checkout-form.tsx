"use client";
import { UseCart } from "@/hooks/use-cart";
import Image from "next/image";
import React, { useActionState, useMemo, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { storeOrder } from "../lib/actions";
import { actionResult } from "@/types";

const initialState: actionResult = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="p-[12px_24px] bg-[#0D5CD7] rounded-full text-center font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Processing payment..." : "Checkout Now"}
    </button>
  );
}

interface CheckoutFormProps {
  userId: string;
}

export default function CheckoutForm({ userId }: CheckoutFormProps) {
  const { products } = UseCart();

  const grandTotal = useMemo(() => {
    return products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }, [products]);

  const [state, formAction] = useActionState(storeOrder, initialState);

  // Debug state changes dengan detail lebih
  useEffect(() => {
    console.log("Current state:", state);
    if (state.error) {
      console.error("Order error:", state.error);
      // Show user-friendly error
      alert(`Checkout failed: ${state.error}`);
    }
    if (state.success) {
      console.log("Order success:", state);
    }
  }, [state]);

  // Validasi cart tidak kosong
  if (products.length === 0) {
    return (
      <div className="container max-w-[1130px] mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Your cart is empty
        </h2>
        <a
          href="/products"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <>
      <form
        action={formAction}
        id="checkout-info"
        className="container max-w-[1130px] mx-auto flex justify-between gap-5 mt-[50px] pb-[100px]"
      >
        {/* Hidden fields untuk mengirim data ke server */}
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="total" value={grandTotal} />
        <input type="hidden" name="products" value={JSON.stringify(products)} />

        {/* Display errors jika ada */}
        {state.error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50 max-w-md">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">Checkout Error</h4>
                <p className="text-sm mt-1">{state.error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-white hover:text-gray-200 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Debug info (hapus di production) */}
        <div className="hidden">
          <p>User ID: {userId}</p>
          <p>Total: {grandTotal}</p>
          <p>Products: {products.length}</p>
        </div>

        {/* form checkout */}
        <div className="w-[650px] flex flex-col shrink-0 gap-4 h-fit">
          <h2 className="font-bold text-2xl leading-[34px]">
            Your Shipping Address
          </h2>
          <div className="flex flex-col gap-5 p-[30px] rounded-3xl border border-[#E5E5E5] bg-white">
            <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
              <div className="flex shrink-0">
                <img src="/assets/icons/profile-circle.svg" alt="icon" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
                placeholder="Write your real complete name"
                required
              />
            </div>

            <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
              <div className="flex shrink-0">
                <img src="/assets/icons/house-2.svg" alt="icon" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
                placeholder="Write your active house address"
                required
              />
            </div>

            <div className="flex items-center gap-[30px]">
              <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
                <div className="flex shrink-0">
                  <img src="/assets/icons/global.svg" alt="icon" />
                </div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
                  placeholder="City"
                  required
                />
              </div>
              <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
                <div className="flex shrink-0">
                  <img src="/assets/icons/location.svg" alt="icon" />
                </div>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
                  placeholder="Post code"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-[10px] rounded-[20px] border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
              <div className="flex shrink-0">
                <img src="/assets/icons/note.svg" alt="icon" />
              </div>
              <textarea
                name="notes"
                id="notes"
                className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black resize-none"
                rows={6}
                placeholder="Additional notes for courier"
                defaultValue={""}
              />
            </div>

            <div className="flex items-center gap-[10px] rounded-full border border-[#E5E5E5] p-[12px_20px] focus-within:ring-2 focus-within:ring-[#FFC736] transition-all duration-300">
              <div className="flex shrink-0">
                <img src="/assets/icons/call.svg" alt="icon" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="appearance-none outline-none w-full placeholder:text-[#616369] placeholder:font-normal font-semibold text-black"
                placeholder="Write your phone number or whatsapp"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex flex-1 flex-col shrink-0 gap-4 h-fit">
          <h2 className="font-bold text-2xl leading-[34px]">Payment Details</h2>
          <div className="w-full bg-white border border-[#E5E5E5] flex flex-col gap-[30px] p-[30px] rounded-3xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex shrink-0">
                    <Image
                      width={24}
                      height={24}
                      src="/assets/icons/tick-circle.svg"
                      alt="icon"
                    />
                  </div>
                  <p>Sub Total</p>
                </div>
                <p className="font-semibold">
                  Rp {grandTotal.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Grand Total</p>
              <p className="font-bold text-[32px] leading-[48px] underline text-[#0D5CD7]">
                Rp {grandTotal.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <SubmitButton />
              <a
                href="/contact"
                className="p-[12px_24px] bg-white rounded-full text-center font-semibold border border-[#E5E5E5] hover:bg-gray-50"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
