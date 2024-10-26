"use server";
import User from "../models/user.model";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";
import { ObjectId } from "mongoose";

function formatDateToLocalISOString(dateStr: string, timeStr: string): string {
  // Check if the date or time is "TBD"
  if (dateStr === "TBD" || timeStr === "TBD") {
    console.warn(`Date or time is TBD. Date: ${dateStr}, Time: ${timeStr}`);
    return ''; // Return an empty string or handle it as needed
  }

  // Split the date string (e.g., 'Friday, November 18, 2024') into its components
  const [, month, day, year] = dateStr.split(" ");

  // Create a full date string that JavaScript's Date object can parse (e.g., 'November 18, 2024 10:30')
  const fullDateStr = `${month} ${day.replace(',', '')}, ${year} ${timeStr}`;

  // Create a new Date object in the user's local time zone
  const date = new Date(fullDateStr);

  // Ensure the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", fullDateStr);
    return '';
  }

  // Return the date in ISO 8601 format (e.g., '2024-11-18T10:30:00.000Z')
  return date.toISOString(); // This will return the ISO format (e.g., '2024-11-18T10:30:00.000Z')
}

export interface EventObject {
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    price: string;
    description: string;
    image: string;
    isRsvp?: boolean;
  }

export async function newEvent(name: string, date: string, time: string, location: string, price: string, description: string, image: string): Promise<void> {
  try {
    await connectToDB();

    if (!name || !date || !time || !location || !price || !description || !image) {
      throw new Error('All fields are required.');
    }

    const newEvent = new Event({ name, date, time, location, price, description, image });
    await newEvent.save();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error adding event: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getAllEvents(userId: string | undefined): Promise<EventObject[]> {
  try {
    await connectToDB();
    const events = await Event.find();

    let rsvpEventIds: Set<string> = new Set();
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found.");
      }
      // Ensure myEvents are converted to strings
      rsvpEventIds = new Set((user.myEvents || []).map((eventId: ObjectId) => eventId.toString()));
    }

    const now = new Date();

    const sortedEvents = events
      .map((event) => {
        const eventObject = event.toObject();
        const formattedDate = formatDateToLocalISOString(eventObject.date, eventObject.time);

        return {
          id: eventObject._id.toString(),
          name: eventObject.name,
          date: eventObject.date,
          time: eventObject.time,
          location: eventObject.location,
          price: eventObject.price,
          description: eventObject.description,
          image: eventObject.image,
          isRsvp: userId ? rsvpEventIds.has(eventObject._id.toString()) : false,
          formattedDate: formattedDate
        };
      })
      // Filter out events with dates in the past
      .filter((event) => {
        const eventDate = event.formattedDate ? new Date(event.formattedDate) : null;
      
        // If eventDate is null (i.e., "TBD"), include the event. Otherwise, compare it with the current time.
        const includeEvent = !eventDate || eventDate >= now;
        return includeEvent;
      })      
      // Sort events by the formatted date
      .sort((a, b) => {
        // Handle "TBD" cases: If either formattedDate is empty, treat it as greater (should appear last)
        if (!a.formattedDate) return 1; // 'a' is TBD, move it after 'b'
        if (!b.formattedDate) return -1; // 'b' is TBD, move it after 'a'
      
        // Otherwise, compare the two dates
        return a.formattedDate.localeCompare(b.formattedDate);
      });
    return sortedEvents;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching all events:", error.message); // Log the error
      throw new Error(`Error fetching all events: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while fetching events');
    }
  }
}

export async function getEventRsvpCounts(): Promise<{ eventName: string; rsvpCount: number }[]> {
  try {
    await connectToDB();
    const events = await Event.find();

    // Create an array to hold event names and RSVP counts
    const eventRsvpCounts: { eventName: string; rsvpCount: number }[] = [];

    // Iterate over each event to count RSVPs
    for (const event of events) {
      const rsvpCount = await User.countDocuments({ myEvents: event._id }); // Count users who RSVP'd for this event
      eventRsvpCounts.push({ eventName: event.name, rsvpCount }); // Add to the result array
    }

    return eventRsvpCounts; // Return the array of event names and RSVP counts
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching event RSVP counts: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while fetching event RSVP counts');
    }
  }
}
