// app/api/webhooks/upgrade/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { upgradeToVIP } from "@/app/lib/actions/user.action";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Check if this is an upgrade (not initial membership)
      if (session.metadata?.type === "upgrade" && session.metadata?.userId) {
        const userId = session.metadata.userId;

        try {
          // Upgrade user to VIP
          await upgradeToVIP(userId);
          console.log(`Successfully upgraded user ${userId} to VIP`);
        } catch (error) {
          console.error("Failed to upgrade user to VIP:", error);
          return NextResponse.json(
            { error: "Failed to upgrade user" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
