import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
// GET: Fetch all orders for admin
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error("GET Admin Orders Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}