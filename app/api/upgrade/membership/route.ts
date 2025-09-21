// app/api/upgrade/membership/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const { email, userId } = body as { email?: string; userId?: string };

    // Production mode - Stripe must be properly configured

    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/membership/success?session_id={CHECKOUT_SESSION_ID}&upgrade=true&userId=${userId}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/profile?canceled=1`,
      customer_email: email || undefined,
      billing_address_collection: "auto",
      allow_promotion_codes: false,
      metadata: {
        product: "wcs_membership_upgrade_2025_26",
        userId: userId || "",
        type: "upgrade",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Create Upgrade Session error:", err);
    return NextResponse.json(
      { error: err.message || "Unable to create upgrade session" },
      { status: 500 }
    );
  }
}
