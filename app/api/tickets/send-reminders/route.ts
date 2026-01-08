import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectToDB } from "@/app/lib/mongoose";
import Ticket from "@/app/lib/models/ticket.model";
import Event from "@/app/lib/models/event.model";
import {
  sendEventReminderEmail,
  generateGoogleCalendarLink,
} from "@/app/lib/actions/ticket.action";

/**
 * POST /api/tickets/send-reminders
 * Send reminder emails for an event (can be called manually or via cron)
 * Body: { eventId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { eventId } = body as { eventId?: string };

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get all tickets for this event that haven't received reminders
    const tickets = await Ticket.find({
      eventId,
      paymentStatus: { $in: ["free", "completed"] },
      reminderSent: false,
    }).populate("userId");

    if (tickets.length === 0) {
      return NextResponse.json({
        message: "No tickets found or all reminders already sent",
        count: 0,
      });
    }

    const googleCalendarLink = await generateGoogleCalendarLink({
      name: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
    });

    // Send reminder emails
    const emailPromises = tickets.map(async (ticket: any) => {
      try {
        const user = ticket.userId;
        if (!user) return;

        await sendEventReminderEmail({
          to: ticket.userEmail,
          firstName: user.firstName,
          eventName: event.name,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          ticketNumber: ticket.ticketNumber,
          googleCalendarLink,
        });

        // Mark reminder as sent
        ticket.reminderSent = true;
        await ticket.save();

        return { success: true, ticketNumber: ticket.ticketNumber };
      } catch (error) {
        console.error(
          `Error sending reminder for ticket ${ticket.ticketNumber}:`,
          error
        );
        return { success: false, ticketNumber: ticket.ticketNumber };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r?.success).length;

    return NextResponse.json({
      success: true,
      message: `Reminder emails sent`,
      total: tickets.length,
      successful: successCount,
      failed: tickets.length - successCount,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
