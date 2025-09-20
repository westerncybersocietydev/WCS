import User from "@/app/lib/models/user.model";
import { connectToDB } from "@/app/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectToDB();
    const { uwoEmail } = await req.json();

    // DEV MODE - Always skip email validation in development for testing
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🚀 DEV MODE: Bypassing email validation - allowing all signups"
      );
      return NextResponse.json(false, { status: 200 });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ uwoEmail });

    if (!existingUser) {
      console.log("Email not used.");
      return NextResponse.json(false, { status: 200 });
    }
    console.log("Email used.");
    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    // In development mode, return false instead of error to allow signup to continue
    if (process.env.NODE_ENV === "development") {
      console.log("🚀 DEV MODE: Database error - allowing signup to continue");
      return NextResponse.json(false, { status: 200 });
    }
    return NextResponse.json(
      { error: `Failed to fetch user data: ${error}` },
      { status: 500 }
    );
  }
};

export const POST = handler;
