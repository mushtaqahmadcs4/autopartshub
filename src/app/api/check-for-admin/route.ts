import { NextResponse } from "next/server";
import User from "@/models/user.model" // Make sure to import your User Mongoose model
import connectDB from "@/lib/db"; // Make sure to import your database connection utility

export async function GET() {
  try {
    // 1. Always connect to MongoDB first
    await connectDB();

    // 2. Search for any user with the role "admin"
    const user = await User.find({ role: "admin" });

    // 3. If one or more admins exist
    if (user.length > 0) {
      return NextResponse.json(
        { adminExist: true },
        { status: 200 }
      );
    } else {
      // 4. If no admin exists yet
      return NextResponse.json(
        { adminExist: false },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error checking for admin:", error);
    return NextResponse.json(
      { message: "Server error checking admin status", error: error.message },
      { status: 500 }
    );
  }
}