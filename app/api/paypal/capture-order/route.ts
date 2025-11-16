// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
import { capturePayPalOrder, getPayPalOrder } from "@/app/lib/paypal";
import { upgradeToVIP } from "@/app/lib/actions/user.action";

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

    // Get the full order details to extract custom_id (userId)
    const orderDetails = await getPayPalOrder(orderId);
    
    // Extract userId from purchase_units custom_id
    const customId = orderDetails?.purchase_units?.[0]?.custom_id;
    
    if (customId && /^[0-9a-fA-F]{24}$/.test(customId)) {
      try {
        // Immediately upgrade the user after successful capture
        await upgradeToVIP(customId);
        console.log(`User ${customId} upgraded to VIP after payment capture`);
        
        return NextResponse.json({
          success: true,
          order: captureResult,
          upgraded: true,
          userId: customId,
        });
      } catch (upgradeError) {
        console.error("Failed to upgrade user:", upgradeError);
        // Still return success for the payment, but indicate upgrade failed
        return NextResponse.json({
          success: true,
          order: captureResult,
          upgraded: false,
          error: "Payment captured but upgrade failed",
        });
      }
    }

    return NextResponse.json({
      success: true,
      order: captureResult,
      upgraded: false,
      error: "No valid user ID found in order",
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
