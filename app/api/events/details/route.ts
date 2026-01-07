import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectToDB } from "@/app/lib/mongoose";
import Event from "@/app/lib/models/event.model";

/**
 * GET /api/events/details?id=eventId
 * Returns full event details
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const eventId = searchParams.get("id");

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: event._id.toString(),
      name: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
      price: event.price,
      description: event.description,
      image: event.image,
    });
  } catch (error) {
    console.error("Error fetching event details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

