// app/api/upgrade/membership/route.ts
// STRIPE CODE DISABLED - Now using PayPal for membership payments
// import Stripe from "stripe";
import { NextResponse } from "next/server";
import User from "@/app/lib/models/user.model";
import { connectToDB } from "@/app/lib/mongoose";
import { createPayPalOrder } from "@/app/lib/paypal";

// STRIPE CODE DISABLED
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const { userId } = body as { userId?: string };

    // Validate input
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Valid user ID is required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId.trim())) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // PayPal configuration check
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "PayPal credentials not configured" },
        { status: 500 }
      );
    }

    // Connect to database and fetch user email
    await connectToDB();
    const user = await User.findById(userId.trim());

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use user's preferred email if available, otherwise use UWO email
    const userEmail = user.preferredEmail?.trim() || user.uwoEmail;

    // STRIPE CODE DISABLED - Original Stripe checkout session creation
    // const session = await stripe.checkout.sessions.create({
    //   mode: "payment",
    //   payment_method_types: ["card"],
    //   line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    //   success_url: `${
    //     process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    //   }/membership/success?session_id={CHECKOUT_SESSION_ID}&upgrade=true&userId=${userId}`,
    //   cancel_url: `${
    //     process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    //   }/profile?canceled=1`,
    //   customer_email: userEmail,
    //   billing_address_collection: "auto",
    //   allow_promotion_codes: false,
    //   metadata: {
    //     product: "wcs_membership_upgrade_2025_26",
    //     userId: userId,
    //     type: "upgrade",
    //   },
    // });
    // return NextResponse.json({ url: session.url });

    // PAYPAL IMPLEMENTATION - Create PayPal order
    const amount = 15.0; // VIP membership price in CAD
    const baseSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const returnUrl = `${baseSiteUrl}/membership/success?upgrade=true&userId=${userId}`;
    const cancelUrl = `${baseSiteUrl}/profile?canceled=1`;

    const order = await createPayPalOrder(
      amount,
      "CAD",
      {
        userId: userId,
        email: userEmail,
        type: "upgrade",
      },
      returnUrl,
      cancelUrl
    );

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
    console.error("Create Upgrade Session error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Unable to create upgrade session",
      },
      { status: 500 }
    );
  }
}
