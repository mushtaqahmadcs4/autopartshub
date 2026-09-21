import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();

    const { 
      user, 
      items, 
      shippingAddress, 
      subtotal, 
      shippingFee, 
      totalAmount, 
      paymentMethod,
      paymentDetails
    } = body;

    // 1. Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart items are required to place an order." },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return NextResponse.json(
        { success: false, message: "Complete shipping address is required." },
        { status: 400 }
      );
    }

    // 2. Create Order in DB
    const newOrder = await Order.create({
      user: user || null,
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      paymentDetails: paymentDetails || {},
      isPaid: paymentMethod === "card",
      paidAt: paymentMethod === "card" ? new Date() : null,
      orderStatus: "Pending"
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Order placed successfully!", 
        orderId: newOrder._id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to place order.", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}