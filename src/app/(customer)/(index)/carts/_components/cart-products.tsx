"use client";

import { UseCart } from "@/hooks/use-cart";
import { getImageUrl } from "@/lib/supabase";
import Image from "next/image";
import React from "react";

export default function CartProducts() {
  const { products, increaseQuantity, decreaseQuantity, removeProduct } =
    UseCart();

  return (
    <>
      <div
        id="cart"
        className="container max-w-[1130px] mx-auto flex flex-col gap-5 mt-[50px]"
      >
        {products.map((cart) => (
          <div
            key={cart.id + cart.name}
            className="product-total-card bg-white flex items-center justify-between p-5 rounded-[20px] border border-[#E5E5E5]"
          >
            <div className="flex items-center w-[340px] gap-5">
              <div className="w-[120px] h-[70px] flex shrink-0 overflow-hidden items-center justify-center">
                <Image
                  width={120}
                  height={70}
                  src={getImageUrl(cart.image_url[0], "products")}
                  className="w-full h-full object-contain"
                  alt={cart.name}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold leading-[22px]">{cart.name}</p>
                <p className="text-sm text-[#616369]">{cart.category_name}</p>
              </div>
            </div>
            <div className="w-[150px] flex flex-col gap-1">
              <p className="text-sm text-[#616369]">Price</p>
              <p className="font-semibold text-[#0D5CD7] leading-[22px]">
                Rp {cart.price.toLocaleString()}
              </p>
            </div>
            <div className="w-[120px] flex flex-col gap-1">
              <p className="text-sm text-[#616369]">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(cart.id)}
                  className="w-6 h-6 flex shrink-0"
                >
                  <Image
                    src="/assets/icons/minus-cirlce.svg"
                    alt="minus"
                    width={24}
                    height={24}
                  />
                </button>
                <p className="text-[#0D5CD7] font-semibold leading-[22px]">
                  {cart.quantity}
                </p>
                <button
                  onClick={() => increaseQuantity(cart.id)}
                  className="w-6 h-6 flex shrink-0"
                >
                  <Image
                    src="/assets/icons/add-circle.svg"
                    alt="plus"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>
            <div className="w-[150px] flex flex-col gap-1">
              <p className="text-sm text-[#616369]">Total</p>
              <p className="font-semibold text-[#0D5CD7] leading-[22px]">
                Rp {(cart.price * cart.quantity).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => removeProduct(cart.id)}
              className="p-[12px_24px] bg-white rounded-full text-center font-semibold border border-[#E5E5E5]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
