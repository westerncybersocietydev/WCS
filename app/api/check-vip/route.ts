import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { checkVIP } from "@/app/lib/actions/user.action";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * GET /api/check-vip
 * Returns whether the current user is a VIP member
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const isVIP = await checkVIP(decoded.userId);

    return NextResponse.json({ isVIP });
  } catch (error) {
    console.error("Error checking VIP status:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

