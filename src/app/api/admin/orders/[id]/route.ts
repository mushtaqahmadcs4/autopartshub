import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
// PATCH: Update orderStatus or isPaid for a specific order ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { orderStatus, isPaid } = body;

    const updateData: Record<string, any> = {};

    // Validate and update orderStatus
    if (orderStatus) {
      const validStatuses = ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"];
      if (!validStatuses.includes(orderStatus)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status provided" },
          { status: 400 }
        );
      }
      updateData.orderStatus = orderStatus;
    }

    // Update isPaid and manage paidAt timestamp
    if (typeof isPaid === "boolean") {
      updateData.isPaid = isPaid;
      updateData.paidAt = isPaid ? new Date() : null;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("PATCH Admin Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}