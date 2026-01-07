import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/app/lib/mongoose";
import User from "@/app/lib/models/user.model";
import Event from "@/app/lib/models/event.model";
import { capturePayPalOrder } from "@/app/lib/paypal";
import {
  createPaidTicket,
  sendTicketConfirmationEmail,
  generateGoogleCalendarLink,
} from "@/app/lib/actions/ticket.action";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * API route to capture PayPal payment and create ticket
 */
export async function POST(req: NextRequest) {
  try {
    // Get JWT token from cookie
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
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
    const { orderID, eventId } = body as { orderID?: string; eventId?: string };

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

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

    // Capture PayPal order
    const captureResult = await capturePayPalOrder(orderID);

    // Check if payment was successful
    if (
      captureResult.status !== "COMPLETED" &&
      captureResult.status !== "APPROVED"
    ) {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get amount paid from PayPal response
    const amountPaid =
      parseFloat(
        captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.amount
          ?.value || "0"
      ) || 2.0;

    // Get event details for email
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Create ticket in database
    const ticket = await createPaidTicket(
      userId,
      eventId,
      orderID,
      amountPaid
    );

    // Send confirmation email
    try {
      const emailTo = user.preferredEmail || user.uwoEmail;
      await sendTicketConfirmationEmail({
        to: emailTo,
        firstName: user.firstName,
        lastName: user.lastName,
        eventName: event.name,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        ticketNumber: ticket.ticketNumber,
        isVIP: false,
        googleCalendarLink: await generateGoogleCalendarLink({
          name: event.name,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
        }),
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the ticket creation if email fails
    }

    return NextResponse.json({
      success: true,
      ticketId: ticket.ticketId,
      ticketNumber: ticket.ticketNumber,
      status: "completed",
    });
  } catch (error) {
    console.error("Error in capture-order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

