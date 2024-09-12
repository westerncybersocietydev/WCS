import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20"
});

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const amount = Number(data.amount);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'CAD'
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}