// app/api/paypal/health/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongoose";

/**
 * Health check endpoint to verify PayPal configuration
 * This helps debug production issues without exposing sensitive data
 */
export async function GET() {
  const hasClientId = !!process.env.PAYPAL_CLIENT_ID;
  const hasClientSecret = !!process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || "not set";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "not set";
  const hasMongoUrl = !!process.env.MONGODB_URL;

  // Test database connection
  let dbStatus = "not tested";
  try {
    await connectToDB();
    dbStatus = "connected";
  } catch (dbError) {
    dbStatus = `error: ${dbError instanceof Error ? dbError.message : "unknown"}`;
  }

  return NextResponse.json({
    paypalConfigured: hasClientId && hasClientSecret,
    hasClientId,
    hasClientSecret,
    mode,
    siteUrl: siteUrl.replace(/\/$/, ""), // Remove trailing slash
    hasMongoUrl,
    dbStatus,
    timestamp: new Date().toISOString(),
  });
}

