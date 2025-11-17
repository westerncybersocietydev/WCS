// app/api/checkout/membership/route.ts
// STRIPE CODE DISABLED - Now using PayPal for membership payments
// import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/app/lib/paypal";

// STRIPE CODE DISABLED
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const { email } = body as { email?: string };

    // PayPal configuration check
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "PayPal credentials not configured" },
        { status: 500 }
      );
    }

    // STRIPE CODE DISABLED - Original Stripe checkout session creation
    // if (!process.env.STRIPE_PRICE_ID) {
    //   return NextResponse.json(
    //     { error: "Missing STRIPE_PRICE_ID" },
    //     { status: 500 }
    //   );
    // }
    // const session = await stripe.checkout.sessions.create({
    //   mode: "payment",
    //   payment_method_types: ["card"],
    //   line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership?canceled=1`,
    //   customer_email: email || undefined,
    //   billing_address_collection: "auto",
    //   allow_promotion_codes: false,
    //   metadata: { product: "wcs_membership_2025_26" },
    // });
    // return NextResponse.json({ url: session.url });

    // PAYPAL IMPLEMENTATION - Create PayPal order
    const amount = 15.0; // VIP membership price in CAD
    const order = await createPayPalOrder(amount, "CAD", {
      email: email || "",
      type: "new",
    });

    // Find the approval URL from the links array
    const approvalUrl = order.links.find(
      (link) => link.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      return NextResponse.json(
        { error: "No approval URL found in PayPal order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: approvalUrl,
      orderId: order.id,
    });
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
