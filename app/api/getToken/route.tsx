"use server";
import { connectToDB } from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(request: Request) {
    try {
        await connectToDB();

        // Extract the token from the cookies
        const cookies = request.headers.get('cookie') || '';
        const tokenMatch = cookies.match(/authToken=([^;]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (!token) {
            return NextResponse.json({ message: "No token provided" }, { status: 401 });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; firstName: string };

        // Return the email and userId
        return NextResponse.json({ userId: decoded.userId, firstName: decoded.firstName }, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // Return a clear message for expired token
            return NextResponse.json({ message: "Token expired" }, { status: 401 });
        }

        console.error("Error:", error);
        return NextResponse.json({ message: "Failed to verify token", error: error }, { status: 500 });
    }
}