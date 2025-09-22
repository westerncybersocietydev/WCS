// app/api/stripe/webhook/route.ts
export const runtime = "nodejs"; // ensures raw body is accessible

import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text(); // raw body required for signature verification

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Useful fields:
      const email = session.customer_email;
      const amount = session.amount_total; // in cents
      const currency = session.currency;
      const sessionId = session.id;

      console.log("Checkout session completed:", {
        sessionId,
        email,
        amount,
        currency,
        metadata: session.metadata,
      });

      // Handle different types of purchases
      if (session.metadata?.type === "upgrade" && session.metadata?.userId) {
        // This is handled by the upgrade webhook
        console.log("Upgrade purchase detected - handled by upgrade webhook");
      } else {
        // This is a new membership purchase
        console.log("New membership purchase completed:", {
          email,
          sessionId,
          amount: amount ? amount / 100 : 0, // Convert cents to dollars
        });

        // You can add additional logic here for new memberships
        // For example, sending welcome emails, updating external systems, etc.
      }
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 }
    );
  }
}
