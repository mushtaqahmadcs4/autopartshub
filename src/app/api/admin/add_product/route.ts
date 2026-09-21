import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";
import { AutoPart } from "@/models/autoparts.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const partNumber = formData.get("partNumber") as string;
    const brand = formData.get("brand") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const compatibilityRaw = formData.get("compatibility") as string;
    const categoryRaw = formData.get("category") as string;
    const isPopularRaw = formData.get("isPopular") as string;

    const file = formData.get("image") as Blob | null;

    let imageUrl = "";
    if (file && file.size > 0) {
      imageUrl = await uploadOnCloudinary(file);
    }

    let category: string[] = [];
    if (categoryRaw) {
      try {
        const parsed = JSON.parse(categoryRaw);
        category = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        category = categoryRaw.split(",").map((c) => c.trim()).filter(Boolean);
      }
    }

    const compatibility = compatibilityRaw
      ? compatibilityRaw.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const autoPart = await AutoPart.create({
      name,
      partNumber,
      brand,
      category,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      unit,
      description,
      compatibility,
      image: imageUrl,
      isPopular: isPopularRaw === "true", // Only sets true if explicitly passed
    });

    return NextResponse.json(
      { success: true, message: "Auto part added successfully", autoPart },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}