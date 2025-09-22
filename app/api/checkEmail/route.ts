import User from "@/app/lib/models/user.model";
import { connectToDB } from "@/app/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectToDB();
    const { uwoEmail } = await req.json();

    // Validate email input
    if (!uwoEmail || typeof uwoEmail !== "string" || !uwoEmail.trim()) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Production mode - real email validation required
    // Check if user with this email already exists
    const existingUser = await User.findOne({ uwoEmail: uwoEmail.trim() });

    if (!existingUser) {
      console.log("Email not used:", uwoEmail);
      return NextResponse.json(false, { status: 200 });
    }
    console.log("Email used:", uwoEmail);
    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Production mode - return proper error
    return NextResponse.json(
      { error: `Failed to check email availability: ${error}` },
      { status: 500 }
    );
  }
};

export const POST = handler;
