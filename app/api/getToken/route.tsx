// /app/api/getUser.ts
"use server";
import { connectToDB } from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  await connectToDB();

  // Middleware has already verified the token, so just decode it
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  // DEV MODE - Skip JWT verification in development if JWT_SECRET is not set
  if (process.env.NODE_ENV === "development" && !process.env.JWT_SECRET) {
    console.log("🚀 DEV MODE: Skipping JWT verification in getToken");
    return NextResponse.json(
      { userId: "507f1f77bcf86cd799439011", firstName: "Dev" },
      { status: 200 }
    );
  }

  // Decode token without verifying (already done in middleware)
  const decoded = jwt.decode(token) as { userId: string; firstName: string };

  // Return user data
  return NextResponse.json(
    { userId: decoded.userId, firstName: decoded.firstName },
    { status: 200 }
  );
}
