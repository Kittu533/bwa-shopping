"use server"

import { schemaShippingAddress } from "@/lib/schema";
import { actionResult, Tcart } from "@/types";
import { generateRandomString } from "@/lib/utils";
import {
  PaymentRequestParameters,
  PaymentRequest,
} from "xendit-node/payment_request/models";
import xenditClient from "@/lib/xendit";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

type OrderProductInput = {
  order_id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
};

export async function storeOrder(
  prevState: unknown,
  formData: FormData
): Promise<actionResult> {
  console.log("=== STORE ORDER STARTED ===");

  const userId = formData.get("userId") as string;
  console.log("UserId:", userId);

  if (!userId) {
    console.log("No userId found");
    return { success: false, error: "Unauthorized" };
  }

  const total = Number(formData.get("total"));
  const productsData = formData.get("products");
  console.log("Total:", total);
  console.log("Products data:", productsData);
  const products: Tcart[] = productsData
    ? JSON.parse(productsData as string)
    : [];

  const parse = schemaShippingAddress.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    postal_code: formData.get("postal_code"),
    notes: formData.get("notes"),
    phone: formData.get("phone"),
  });

  if (!parse.success) {
    console.log("Validation error:", parse.error.issues[0].message);
    return {
      success: false,
      error: parse.error.issues[0].message,
    };
  }

  try {
    console.log("Creating order...");
    const order = await prisma.order.create({
      data: {
        total: total,
        status: "pending",
        user_id: Number(userId),
        code: generateRandomString(15),
      },
    });
    console.log("Order created with code:", order.code);

    const queryCreateProductOrder: OrderProductInput[] = [];

    for (const product of products) {
      queryCreateProductOrder.push({
        order_id: order.id,
        product_id: product.id,
        quantity: product.quantity,
        subtotal: product.price * product.quantity,
      });
    }

    console.log("Creating order products...");
    await prisma.orderProduct.createMany({
      data: queryCreateProductOrder,
    });

    console.log("Creating order detail...");
    await prisma.orderDetail.create({
      data: {
        address: parse.data.address,
        city: parse.data.city,
        name: parse.data.name,
        phone: parse.data.phone,
        postal_code: parse.data.postal_code,
        notes: parse.data.notes,
        order_id: order.id,
      },
    });

    console.log("Creating payment request...");
    
    const data: PaymentRequestParameters = {
      amount: total,
      paymentMethod: {
        ewallet: {
          channelProperties: {
            successReturnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_code=${order.code}`,
            failureReturnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed?order_code=${order.code}`,
          },
          channelCode: "SHOPEEPAY",
        },
        reusability: "ONE_TIME_USE",
        type: "EWALLET",
      },
      currency: "IDR",
      referenceId: order.code,
    };

    console.log("Sending to Xendit with referenceId:", order.code);

    const response: PaymentRequest =
      await xenditClient.PaymentRequest.createPaymentRequest({
        data,
      });

    console.log("Xendit response received:", {
      id: response.id,
      status: response.status,
      referenceId: response.referenceId
    });

    const redirectPaymentUrl =
      response.actions?.find((val) => val.urlType === "DEEPLINK")?.url || "";

    console.log("Redirect URL:", redirectPaymentUrl);

    if (redirectPaymentUrl) {
      console.log("Redirecting to payment gateway...");
      // redirect() akan throw NEXT_REDIRECT - ini normal behavior
      redirect(redirectPaymentUrl);
    } else {
      console.error("No redirect URL found in Xendit response");
      return {
        success: false,
        error: "Payment gateway redirect URL not found",
      };
    }
    
  } catch (error) {
    // PENTING: Jangan tangkap NEXT_REDIRECT sebagai error
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      console.log("Redirect successful - this is expected behavior");
      // Tidak perlu return apapun karena redirect sudah terjadi
      throw error; // Re-throw untuk membiarkan Next.js handle redirect
    }
    
    console.error("=== ORDER ERROR ===", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return {
      success: false,
      error: "Failed to create order or process payment",
    };
  }

  // Code ini tidak akan pernah tercapai karena redirect() akan stop execution
  return {
    success: true,
    message: "Order created successfully",
  };
}