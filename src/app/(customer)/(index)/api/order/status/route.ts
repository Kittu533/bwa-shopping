import prisma from "../../../../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Webhook received:", JSON.stringify(body, null, 2));

    // Handle test webhook dari Xendit
    if (body.business_id === "sample_business_id" || 
        body.data?.reference_id === "a5151a05-e84d-4cef-bb17-1ref3e7fb3a") {
      console.log("Received test webhook from Xendit - ignoring");
      return NextResponse.json(
        { message: "Test webhook received and ignored" },
        { status: 200 }
      );
    }

    // Validasi apakah ada data yang diperlukan
    if (!body.data || !body.data.reference_id) {
      console.error("Missing reference_id in webhook data");
      return NextResponse.json(
        { error: "Missing reference_id" },
        { status: 400 }
      );
    }

    const code = body.data.reference_id;
    const status = body.data.status;

    console.log("Processing real order:", { code, status });

    // DEBUG: Cek semua orders yang ada di database
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        code: true,
        status: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 10
    });
    
    console.log("Recent orders in database:", allOrders);

    // Cek apakah order exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        code: code,
      },
    });

    if (!existingOrder) {
      console.error("Order not found:", code);
      return NextResponse.json({ 
        error: "Order not found",
        received_reference_id: code,
        available_orders: allOrders.map(o => ({ id: o.id, code: o.code }))
      }, { status: 404 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: {
        code: code,
      },
      data: {
        status: status === "SUCCEEDED" ? "success" : "failed",
        updated_at: new Date(),
      },
    });

    console.log("Order updated successfully:", updatedOrder);

    return NextResponse.json(
      {
        message: "Order status updated successfully",
        order_id: updatedOrder.id,
        new_status: updatedOrder.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}