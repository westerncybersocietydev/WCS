// Test endpoint to verify Stripe configuration
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  try {
    // Check if Stripe keys are configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripePriceId = process.env.STRIPE_PRICE_ID;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    // Basic validation
    const config: {
      stripeSecretKey: string;
      stripePublishableKey: string;
      stripePriceId: string;
      webhookSecret: string;
      siteUrl: string;
      stripeConnection?: string;
      balance?: string;
      stripeError?: string;
    } = {
      stripeSecretKey: stripeSecretKey ? "✅ Set" : "❌ Missing",
      stripePublishableKey: stripePublishableKey ? "✅ Set" : "❌ Missing",
      stripePriceId: stripePriceId ? "✅ Set" : "❌ Missing",
      webhookSecret: webhookSecret ? "✅ Set" : "❌ Missing",
      siteUrl: siteUrl ? "✅ Set" : "❌ Missing",
    };

    // Test Stripe connection
    if (stripeSecretKey) {
      try {
        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: "2024-06-20",
        });

        // Test API call
        const balance = await stripe.balance.retrieve();
        config.stripeConnection = "✅ Connected";
        config.balance = `$${(balance.available[0]?.amount || 0) / 100}`;
      } catch (error) {
        config.stripeConnection = "❌ Connection Failed";
        config.stripeError =
          error instanceof Error ? error.message : "Unknown error";
      }
    }

    return NextResponse.json({
      message: "Stripe Configuration Test",
      environment: process.env.NODE_ENV,
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
