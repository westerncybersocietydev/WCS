import User from "@/app/lib/models/user.model";
import { connectToDB } from "@/app/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { uwoEmail } = body;

    // Validate email input
    if (!uwoEmail || typeof uwoEmail !== "string" || !uwoEmail.trim()) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    try {
      await connectToDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please try again." },
        { status: 503 }
      );
    }

    // Check if user with this email already exists
    try {
      const existingUser = await User.findOne({ uwoEmail: uwoEmail.trim() });

      if (!existingUser) {
        console.log("Email not used:", uwoEmail);
        return NextResponse.json(false, { status: 200 });
      }
      console.log("Email used:", uwoEmail);
      return NextResponse.json(true, { status: 200 });
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return NextResponse.json(
        { error: "Failed to check email availability" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in checkEmail:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};

export const POST = handler;
