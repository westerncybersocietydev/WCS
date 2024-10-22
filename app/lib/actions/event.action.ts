"use server";
import User from "../models/user.model";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";
import { ObjectId } from "mongoose";

function formatDateToLocalISOString(dateStr: string, timeStr: string): string {
  // Split the date string (e.g., 'Friday, November 18, 2024') into its components
  const [, month, day, year] = dateStr.split(" ");

  // Create a full date string that JavaScript's Date object can parse (e.g., 'November 18, 2024 10:30')
  const fullDateStr = `${month} ${day}, ${year} ${timeStr}`;

  // Create a new Date object in the user's local time zone
  const date = new Date(fullDateStr);

  // Extract and format the parts of the date as YYYYMMDDTHHmmss
  const yearPart = date.getFullYear();
  const monthPart = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const dayPart = String(date.getDate()).padStart(2, '0');
  const hoursPart = String(date.getHours()).padStart(2, '0');
  const minutesPart = String(date.getMinutes()).padStart(2, '0');
  const secondsPart = String(date.getSeconds()).padStart(2, '0');
  return `${yearPart}${monthPart}${dayPart}T${hoursPart}${minutesPart}${secondsPart}`;
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

    const sortedEvents = events
      .map((event) => {
        const eventObject = event.toObject();

        return {
          id: eventObject._id.toString(),
          name: eventObject.name,
          date: eventObject.date, // e.g., 'Friday, November 18, 2024'
          time: eventObject.time, // e.g., '10:30'
          location: eventObject.location,
          price: eventObject.price,
          description: eventObject.description,
          image: eventObject.image,
          isRsvp: userId ? rsvpEventIds.has(eventObject._id.toString()) : false,
          formattedDate: formatDateToLocalISOString(eventObject.date, eventObject.time) // Use the new function
        };
      })
      // Sort events by the formatted date
    return sortedEvents.sort((a, b) => a.formattedDate.localeCompare(b.formattedDate));;
  } catch (error) {
    if (error instanceof Error) {
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
