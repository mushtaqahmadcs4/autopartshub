import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Category } from "@/models/category.model";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({}).sort({ createdAt: 1 });

    return NextResponse.json(
      {
        success: true,
        categories,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Error fetching categories",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      level,
      placeBeforeDefault,
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        {
          status: 400,
        }
      );
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check for duplicate category name/slug
    const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this name already exists.",
        },
        {
          status: 400,
        }
      );
    }

    // Sanitize level to ensure it's either "MAJOR" or "MINOR"
    // to match Mongoose Schema
    const levelStr = String(level).toUpperCase();

    const validLevel = ["MAJOR", "MINOR"].includes(levelStr)
      ? levelStr
      : "MAJOR";

    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      level: validLevel,

      // This value is now properly defined in the
      // Category Mongoose schema.
      placeBeforeDefault: Boolean(placeBeforeDefault),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully!",
        category: newCategory,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("API POST Category Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}