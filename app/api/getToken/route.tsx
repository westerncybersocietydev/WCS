// /app/api/getUser.ts
"use server";
import { connectToDB } from "@/app/lib/mongoose";
import User from "@/app/lib/models/user.model";
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

  // Fetch full profile data from database
  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data with full profile information
    return NextResponse.json(
      {
        userId: decoded.userId,
        firstName: decoded.firstName,
        profileData: {
          firstName: user.firstName,
          lastName: user.lastName,
          uwoEmail: user.uwoEmail,
          preferredEmail: user.preferredEmail,
          currentYear: user.currentYear,
          program: user.program,
          plan: user.plan || "Basic", // Default to Basic if not set
          description: user.description || "",
          avatar: user.avatar || "/defaultPfp.png",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Still return basic user data even if profile fetch fails
    return NextResponse.json(
      { userId: decoded.userId, firstName: decoded.firstName },
      { status: 200 }
    );
  }
}
