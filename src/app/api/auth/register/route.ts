import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { name, email, password } = await req.json();

        const existUser = await User.findOne({ email });
        if (existUser) {
            return NextResponse.json(
                { message: "email already exist" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: "password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const complexityRegix = /^(?=.*[A-Z])(?=.*\d).+$/;
        if (!complexityRegix.test(password)) {
            return NextResponse.json(
                { message: "Password must contain at least one upper case letter and one number" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        return NextResponse.json(
            { message: "User registered successfully!" },
            { status: 201 }
        );

    } catch (error) {
        console.log("the actual error is ",error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}