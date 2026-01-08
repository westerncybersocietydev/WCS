import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/app/lib/mongoose";
import User from "@/app/lib/models/user.model";
import Event from "@/app/lib/models/event.model";
import { checkVIP } from "@/app/lib/actions/user.action";
import { createFreeTicket, hasTicket } from "@/app/lib/actions/ticket.action";
import { getPayPalAccessToken } from "@/app/lib/paypal";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * API route to create a ticket order
 * - If user is VIP: creates free ticket immediately
 * - If user is Basic: creates PayPal order for $2
 */
export async function POST(req: NextRequest) {
  try {
    // Get JWT token from cookie
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { eventId } = body as { eventId?: string };

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user already has a ticket
    const alreadyHasTicket = await hasTicket(userId, eventId);
    if (alreadyHasTicket) {
      const { getUserTicket } = await import("@/app/lib/actions/ticket.action");
      const existingTicket = await getUserTicket(userId, eventId);
      return NextResponse.json(
        {
          error: "You already have a ticket for this event",
          ticketNumber: existingTicket?.ticketNumber,
          alreadyHasTicket: true,
        },
        { status: 400 }
      );
    }

    // Check if user is VIP
    const isVIP = await checkVIP(userId);

    if (isVIP) {
      // VIP members get free tickets
      const ticket = await createFreeTicket(userId, eventId);
      return NextResponse.json({
        member: true,
        ticketId: ticket.ticketId,
        ticketNumber: ticket.ticketNumber,
      });
    }

    // Basic members need to pay $2
    // Create PayPal order
    const accessToken = await getPayPalAccessToken();
    const baseUrl =
      process.env.PAYPAL_MODE === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    const baseSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "CAD",
            value: "2.00",
          },
          description: `WCS ${event.name} - Non-member ticket`,
          custom_id: userId,
        },
      ],
      application_context: {
        brand_name: "Western Cyber Society",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${baseSiteUrl}/ibm-night/ticket/confirm?eventId=${eventId}`,
        cancel_url: `${baseSiteUrl}/ibm-night?canceled=1`,
      },
    };

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PayPal order creation error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        mode: process.env.PAYPAL_MODE,
        baseUrl,
      });
      return NextResponse.json(
        { error: "Failed to create payment order. Please try again." },
        { status: 500 }
      );
    }

    const orderData_response = await response.json();

    return NextResponse.json({
      member: false,
      orderID: orderData_response.id,
    });
  } catch (error) {
    console.error("Error in create-order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

