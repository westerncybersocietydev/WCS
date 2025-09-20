// middleware.ts or middleware.js at the root of the `app` or `src` folder
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export function middleware(request: NextRequest) {
  // Skip middleware for certain API routes that don't need authentication
  const publicRoutes = [
    "/api/checkEmail",
    "/api/checkout/membership",
    "/api/create-intent",
    "/api/createCheckout",
  ];
  if (
    publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    // If no token is found, you can redirect to a login page or return an error
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Skip JWT verification in development if JWT_SECRET is not set
  if (process.env.NODE_ENV === "development" && !JWT_SECRET) {
    console.log("🚀 DEV MODE: Skipping JWT verification");
    return NextResponse.next();
  }

  try {
    // Verify the JWT token
    jwt.verify(token, JWT_SECRET);
    // If the token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to login or handle error
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// Define paths where middleware should be applied or excluded
export const config = {
  matcher: ["/api/:path*"], // Apply middleware to API and protected pages like dashboard
};
