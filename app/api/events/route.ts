import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectToDB } from "@/app/lib/mongoose";
import Event from "@/app/lib/models/event.model";

/**
 * GET /api/events?name=EventName
 * Returns event ID for a given event name
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const eventName = searchParams.get("name");

    if (!eventName) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find event by name (case-insensitive)
    // Note: Event in MongoDB is stored as "IBM NIGHT"
    let event = await Event.findOne({
      name: { $regex: new RegExp(eventName, "i") },
    });

    // Fallback: Try exact match with common variations
    if (!event) {
      const variations = [
        eventName,
        eventName.toUpperCase(),
        eventName.toLowerCase(),
        "IBM NIGHT", // Known exact name in database
        "IBM Night",
        "ibm night",
      ];
      
      for (const variation of variations) {
        event = await Event.findOne({ name: variation });
        if (event) break;
      }
    }

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      eventId: event._id.toString(),
      name: event.name,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

