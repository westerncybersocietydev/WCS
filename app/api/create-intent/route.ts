import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate input
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { amount } = data;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    const amountNumber = Number(amount);

    // Validate amount range
    if (amountNumber > 10000) {
      return NextResponse.json({ error: "Amount too large" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountNumber * 100,
      currency: "CAD",
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
