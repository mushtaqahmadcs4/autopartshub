import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { role, mobile } = await req.json();
    const Session = await auth();

    const user = await User.findOneAndUpdate(
      { email: Session?.user?.email },
      { role, mobile },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "user is not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `edit role and mobile error occur ${error}` }, { status: 500 });
  }
}