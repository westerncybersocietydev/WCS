"use server";
import { connectToDB } from "../mongoose";
import Ticket from "../models/ticket.model";
import User from "../models/user.model";
import Event from "../models/event.model";
import { checkVIP } from "./user.action";
import { sendEmail } from "../../utils/email";

/**
 * Generate a unique ticket number
 */
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WCS-${timestamp}-${random}`;
}

/**
 * Create a free ticket for a member
 */
export async function createFreeTicket(
  userId: string,
  eventId: string
): Promise<{ ticketId: string; ticketNumber: string }> {
  try {
    await connectToDB();

    // Verify user exists and is VIP
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isVIP = await checkVIP(userId);
    if (!isVIP) {
      throw new Error("User is not a VIP member");
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user already has a ticket for this event
    const existingTicket = await Ticket.findOne({
      userId,
      eventId,
      paymentStatus: { $in: ["free", "completed"] },
    });

    if (existingTicket) {
      return {
        ticketId: existingTicket._id.toString(),
        ticketNumber: existingTicket.ticketNumber,
      };
    }

    // Create free ticket
    const ticket = new Ticket({
      eventId,
      userId,
      userEmail: user.preferredEmail || user.uwoEmail,
      paymentStatus: "free",
      amountPaid: 0,
      ticketNumber: generateTicketNumber(),
    });

    await ticket.save();

    // Add event to user's myEvents array if not already there
    if (!user.myEvents.includes(eventId)) {
      user.myEvents.push(eventId);
      await user.save();
    }

    return {
      ticketId: ticket._id.toString(),
      ticketNumber: ticket.ticketNumber,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create free ticket: ${errorMessage}`);
  }
}

/**
 * Create a paid ticket after PayPal payment is captured
 */
export async function createPaidTicket(
  userId: string,
  eventId: string,
  paypalOrderId: string,
  amountPaid: number
): Promise<{ ticketId: string; ticketNumber: string }> {
  try {
    await connectToDB();

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user already has a ticket for this event
    const existingTicket = await Ticket.findOne({
      userId,
      eventId,
      paymentStatus: { $in: ["completed", "free"] },
    });

    if (existingTicket) {
      return {
        ticketId: existingTicket._id.toString(),
        ticketNumber: existingTicket.ticketNumber,
      };
    }

    // Create paid ticket
    const ticket = new Ticket({
      eventId,
      userId,
      userEmail: user.preferredEmail || user.uwoEmail,
      paymentStatus: "completed",
      paypalOrderId,
      amountPaid,
      ticketNumber: generateTicketNumber(),
    });

    await ticket.save();

    // Add event to user's myEvents array if not already there
    if (!user.myEvents.includes(eventId)) {
      user.myEvents.push(eventId);
      await user.save();
    }

    return {
      ticketId: ticket._id.toString(),
      ticketNumber: ticket.ticketNumber,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create paid ticket: ${errorMessage}`);
  }
}

/**
 * Check if user has a ticket for an event
 */
export async function hasTicket(
  userId: string,
  eventId: string
): Promise<boolean> {
  try {
    await connectToDB();

    const ticket = await Ticket.findOne({
      userId,
      eventId,
      paymentStatus: { $in: ["free", "completed"] },
    });

    return !!ticket;
  } catch (error) {
    console.error("Error checking ticket:", error);
    return false;
  }
}

/**
 * Get user's ticket for an event
 */
export async function getUserTicket(
  userId: string,
  eventId: string
): Promise<{
  ticketId: string;
  ticketNumber: string;
  paymentStatus: string;
  amountPaid: number;
} | null> {
  try {
    await connectToDB();

    const ticket = await Ticket.findOne({
      userId,
      eventId,
      paymentStatus: { $in: ["free", "completed"] },
    })
      .populate("eventId", "name date time location")
      .lean() as {
      _id: unknown;
      ticketNumber: string;
      paymentStatus: string;
      amountPaid: number;
    } | null;

    if (!ticket) {
      return null;
    }

    return {
      ticketId: String(ticket._id),
      ticketNumber: ticket.ticketNumber,
      paymentStatus: ticket.paymentStatus,
      amountPaid: ticket.amountPaid,
    };
  } catch (error) {
    console.error("Error getting user ticket:", error);
    return null;
  }
}

/**
 * Generate Google Calendar link for an event
 */
export async function generateGoogleCalendarLink({
  name,
  date,
  time,
  location,
  description,
}: {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
}): Promise<string> {
  try {
    // Parse date (e.g., "Friday, November 18, 2024")
    const [, month, day, year] = date.split(" ");
    const dayNum = day.replace(",", "");
    
    // Parse time (e.g., "7:00 PM")
    const [timePart, modifier] = time.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);
    let hour24 = hours;
    if (modifier === "PM" && hours !== 12) hour24 += 12;
    if (modifier === "AM" && hours === 12) hour24 = 0;

    // Create start date
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthNum = monthNames.indexOf(month) + 1;
    const startDate = new Date(
      parseInt(year),
      monthNum - 1,
      parseInt(dayNum),
      hour24,
      minutes || 0
    );
    
    // End date (1 hour later)
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    // Format for Google Calendar (YYYYMMDDTHHmmss)
    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const h = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      return `${y}${m}${day}T${h}${min}${s}`;
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      name
    )}&dates=${start}/${end}&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(description)}`;
  } catch (error) {
    console.error("Error generating Google Calendar link:", error);
    return "";
  }
}

/**
 * Send ticket confirmation email
 */
export async function sendTicketConfirmationEmail({
  to,
  firstName,
  lastName: _lastName,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  ticketNumber,
  isVIP,
  googleCalendarLink,
}: {
  to: string;
  firstName: string;
  lastName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketNumber: string;
  isVIP: boolean;
  googleCalendarLink?: string;
}): Promise<void> {
  const emailDetails = {
    from: "info@westerncybersociety.ca",
    to,
    subject: `Ticket Confirmed: ${eventName}`,
    message: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ticket Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f7;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                          <tr>
                              <td align="center" style="padding-bottom: 30px;">
                                  <h1 style="color: #1d1d1f; font-size: 32px; font-weight: 600; margin: 0;">Ticket Confirmed!</h1>
                                  <p style="font-size: 18px; color: #6e6e73; margin: 10px 0 0;">You're all set for ${eventName}</p>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 20px 0; line-height: 1.7; font-size: 18px;">
                                  <p>Hi <span style="color: #a723b0; font-weight: 600;">${firstName}</span>,</p>
                                  <p style="margin-bottom: 1em;">Your ticket for <span style="color: #a723b0; font-weight: 600;">${eventName}</span> has been confirmed!</p>
                                  
                                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                      <p style="margin: 0 0 10px 0;"><strong>Ticket Number:</strong> <span style="font-family: monospace; font-size: 20px; color: #a723b0;">${ticketNumber}</span></p>
                                      <p style="margin: 10px 0;"><strong>Event:</strong> ${eventName}</p>
                                      <p style="margin: 10px 0;"><strong>Date:</strong> ${eventDate}</p>
                                      <p style="margin: 10px 0;"><strong>Time:</strong> ${eventTime}</p>
                                      <p style="margin: 10px 0;"><strong>Location:</strong> ${eventLocation}</p>
                                      ${isVIP ? '<p style="margin: 10px 0; color: #10b981;"><strong>Membership:</strong> VIP (Free Ticket)</p>' : '<p style="margin: 10px 0;"><strong>Amount Paid:</strong> $2.00 CAD</p>'}
                                  </div>

                                  ${googleCalendarLink ? `
                                  <div style="text-align: center; margin: 30px 0;">
                                      <a href="${googleCalendarLink}" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 18px;">
                                          Add to Google Calendar
                                      </a>
                                  </div>
                                  ` : ''}

                                  <p style="margin-top: 2em; margin-bottom: 1em;">Please save this email and bring your ticket number to the event for check-in.</p>
                                  <p style="margin-bottom: -1em;">Keep innovating,</p>
                                  <p style="margin-bottom: 1em;">Western Cyber Society Team</p>
                              </td>
                          </tr>
                          <tr>
                              <td align="center" style="margin-top: 60px; font-size: 12px; color: #86868b; border-top: 1px solid #e0e0e2; padding-top: 20px;">
                                  <p>&copy; 2024 Western Cyber Society. All rights reserved.</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `,
  };

  await sendEmail(emailDetails);
}

/**
 * Send event reminder email
 */
export async function sendEventReminderEmail({
  to,
  firstName,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  ticketNumber,
  googleCalendarLink,
}: {
  to: string;
  firstName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketNumber: string;
  googleCalendarLink?: string;
}): Promise<void> {
  const emailDetails = {
    from: "info@westerncybersociety.ca",
    to,
    subject: `Reminder: ${eventName} is Coming Up!`,
    message: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Event Reminder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f7;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                          <tr>
                              <td align="center" style="padding-bottom: 30px;">
                                  <h1 style="color: #1d1d1f; font-size: 32px; font-weight: 600; margin: 0;">Event Reminder</h1>
                                  <p style="font-size: 18px; color: #6e6e73; margin: 10px 0 0;">Don't forget about ${eventName}!</p>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 20px 0; line-height: 1.7; font-size: 18px;">
                                  <p>Hi <span style="color: #a723b0; font-weight: 600;">${firstName}</span>,</p>
                                  <p style="margin-bottom: 1em;">This is a friendly reminder that <span style="color: #a723b0; font-weight: 600;">${eventName}</span> is coming up soon!</p>
                                  
                                  <div style="background-color: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                      <p style="margin: 0 0 10px 0;"><strong>Ticket Number:</strong> <span style="font-family: monospace; font-size: 20px; color: #a723b0;">${ticketNumber}</span></p>
                                      <p style="margin: 10px 0;"><strong>Event:</strong> ${eventName}</p>
                                      <p style="margin: 10px 0;"><strong>Date:</strong> ${eventDate}</p>
                                      <p style="margin: 10px 0;"><strong>Time:</strong> ${eventTime}</p>
                                      <p style="margin: 10px 0;"><strong>Location:</strong> ${eventLocation}</p>
                                  </div>

                                  ${googleCalendarLink ? `
                                  <div style="text-align: center; margin: 30px 0;">
                                      <a href="${googleCalendarLink}" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 18px;">
                                          Add to Google Calendar
                                      </a>
                                  </div>
                                  ` : ''}

                                  <p style="margin-top: 2em; margin-bottom: 1em;">We look forward to seeing you there! Don't forget to bring your ticket number for check-in.</p>
                                  <p style="margin-bottom: -1em;">Keep innovating,</p>
                                  <p style="margin-bottom: 1em;">Western Cyber Society Team</p>
                              </td>
                          </tr>
                          <tr>
                              <td align="center" style="margin-top: 60px; font-size: 12px; color: #86868b; border-top: 1px solid #e0e0e2; padding-top: 20px;">
                                  <p>&copy; 2024 Western Cyber Society. All rights reserved.</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `,
  };

  await sendEmail(emailDetails);
}

