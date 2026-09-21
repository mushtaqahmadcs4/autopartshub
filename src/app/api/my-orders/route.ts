import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // Fetch orders sorted by creation date (newest first)
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, count: orders.length, orders },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to retrieve order history.", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}