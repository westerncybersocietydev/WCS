// app/api/checkout/membership/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const { email } = body as { email?: string };

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership?canceled=1`,
      customer_email: email || undefined,
      billing_address_collection: "auto",
      allow_promotion_codes: false,
      metadata: { product: "wcs_membership_2025_26" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Create Checkout Session error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unable to create session",
      },
      { status: 500 }
    );
  }
}
