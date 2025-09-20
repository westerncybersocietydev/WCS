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

      // TODO: replace this with DB/Google Sheets call / Zapier webhook
      console.log("Checkout session completed:", {
        sessionId,
        email,
        amount,
        currency,
      });

      // Example: call internal API / database here to create member record
      // await db.members.create({ email, amount, stripeSessionId: sessionId });
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
