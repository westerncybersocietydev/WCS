// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/app/lib/paypal";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const { orderId } = body as { orderId?: string };

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(orderId);

    return NextResponse.json({
      success: true,
      order: captureResult,
    });
  } catch (err: unknown) {
    console.error("Capture PayPal Order error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Unable to capture PayPal order",
      },
      { status: 500 }
    );
  }
}
