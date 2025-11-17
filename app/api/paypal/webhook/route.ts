// app/api/paypal/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { upgradeToVIP } from "@/app/lib/actions/user.action";

export const runtime = "nodejs"; // ensures raw body is accessible

/**
 * PayPal Webhook Handler
 * Handles payment completion events from PayPal
 *
 * Note: For production, you should verify webhook signatures
 * See: https://developer.paypal.com/docs/api-basics/notifications/webhooks/notification-messages/
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // PayPal webhook event types we care about
    const eventType = body.event_type;
    const resource = body.resource;

    console.log("PayPal webhook received:", {
      eventType,
      orderId: resource?.id,
    });

    // Handle payment capture completed event
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = resource?.supplementary_data?.related_ids?.order_id;
      const amount = resource?.amount?.value;
      const currency = resource?.amount?.currency_code;
      const customId = resource?.custom_id; // This is where we store userId

      console.log("Payment captured:", {
        orderId,
        amount,
        currency,
        customId,
      });

      // If customId contains userId, upgrade the user to VIP
      if (customId && /^[0-9a-fA-F]{24}$/.test(customId)) {
        try {
          await upgradeToVIP(customId);
          console.log(
            `Successfully upgraded user ${customId} to VIP via PayPal`
          );
        } catch (error) {
          console.error("Failed to upgrade user to VIP:", error);
          // Don't return error - webhook should still return 200
        }
      }
    }

    // Handle order completed event (alternative)
    if (eventType === "CHECKOUT.ORDER.COMPLETED") {
      const orderId = resource?.id;
      const purchaseUnits = resource?.purchase_units;

      if (purchaseUnits && purchaseUnits.length > 0) {
        const customId = purchaseUnits[0]?.custom_id;

        if (customId && /^[0-9a-fA-F]{24}$/.test(customId)) {
          try {
            await upgradeToVIP(customId);
            console.log(
              `Successfully upgraded user ${customId} to VIP via PayPal order completion`
            );
          } catch (error) {
            console.error("Failed to upgrade user to VIP:", error);
          }
        }
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("PayPal webhook error:", err);
    // Still return 200 to prevent PayPal from retrying
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Webhook processing error",
      },
      { status: 200 }
    );
  }
}
