import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/app/lib/mongoose";
import User from "@/app/lib/models/user.model";
import Event from "@/app/lib/models/event.model";
import { checkVIP } from "@/app/lib/actions/user.action";
import {
  createFreeTicket,
  sendTicketConfirmationEmail,
  generateGoogleCalendarLink,
  hasTicket,
  getUserTicket,
} from "@/app/lib/actions/ticket.action";

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * API route for VIP members to RSVP
 * Creates a free ticket and sends confirmation email
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
    const {
      eventId,
      firstName,
      lastName,
      uwoEmail,
      gmail,
      attending,
    } = body as {
      eventId?: string;
      firstName?: string;
      lastName?: string;
      uwoEmail?: string;
      gmail?: string;
      attending?: "yes" | "no";
    };

    if (!eventId || !firstName || !lastName || !uwoEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Verify user exists and is VIP
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isVIP = await checkVIP(userId);
    if (!isVIP) {
      return NextResponse.json(
        { error: "This form is for VIP members only" },
        { status: 403 }
      );
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user already has a ticket for this event
    const alreadyHasTicket = await hasTicket(userId, eventId);
    if (alreadyHasTicket) {
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

    // Only create ticket if attending
    if (attending === "yes") {
      // Create free ticket
      const ticket = await createFreeTicket(userId, eventId);

      // Send confirmation email
      const emailTo = gmail || user.preferredEmail || user.uwoEmail;
      try {
        await sendTicketConfirmationEmail({
          to: emailTo,
          firstName,
          lastName,
          eventName: event.name,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          ticketNumber: ticket.ticketNumber,
          isVIP: true,
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
        // Don't fail the RSVP if email fails
      }

      return NextResponse.json({
        success: true,
        ticketId: ticket.ticketId,
        ticketNumber: ticket.ticketNumber,
      });
    } else {
      // User is not attending - just confirm RSVP received
      return NextResponse.json({
        success: true,
        message: "RSVP received. We're sorry you can't make it!",
        attending: false,
      });
    }
  } catch (error) {
    console.error("Error in VIP RSVP:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

