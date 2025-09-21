import User from "@/app/lib/models/user.model";
import { connectToDB } from "@/app/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectToDB();
    const { uwoEmail } = await req.json();

    // Production mode - real email validation required

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
    // Production mode - return proper error
    return NextResponse.json(
      { error: `Failed to fetch user data: ${error}` },
      { status: 500 }
    );
  }
};

export const POST = handler;
