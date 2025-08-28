import { create } from "zustand";
import { Tcart } from "./../types/index";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  products: Tcart[];
  addProduct: (cart: Tcart) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeProduct: (id: number) => void;
}

export const UseCart = create<CartState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (cart) =>
        set({
          products: [
            ...get().products.filter((item) => item.id !== cart.id),
            cart,
          ],
        }),
      increaseQuantity: (id) => {
        const newProduct = get().products.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
        set({
          products: newProduct,
        });
      },
      decreaseQuantity: (id) => {
        const newProduct = get().products.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        set({
          products: newProduct,
        });
      },
      removeProduct: (id) => {
        set({
          products: get().products.filter((item) => item.id !== id),
        });
      },
    }),
    {
      name: 'cart-product-belanja',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);