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

  // Production mode - JWT verification always required

  // Decode token without verifying (already done in middleware)
  const decoded = jwt.decode(token) as {
    userId: string;
    firstName: string;
  } | null;

  if (!decoded || !decoded.userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // Return user data
  return NextResponse.json(
    { userId: decoded.userId, firstName: decoded.firstName },
    { status: 200 }
  );
}
