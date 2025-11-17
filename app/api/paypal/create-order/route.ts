// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/app/lib/paypal";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const { userId, email, isUpgrade } = body as {
      userId?: string;
      email?: string;
      isUpgrade?: boolean;
    };

    // Membership price in CAD
    const amount = 15.0;
    const currency = "CAD";

    // Create PayPal order
    const order = await createPayPalOrder(amount, currency, {
      userId: userId || "",
      email: email || "",
      type: isUpgrade ? "upgrade" : "new",
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
      orderId: order.id,
      approvalUrl: approvalUrl,
      status: order.status,
    });
  } catch (err: unknown) {
    console.error("Create PayPal Order error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Unable to create PayPal order",
      },
      { status: 500 }
    );
  }
}
