"use server";
import User from "../models/user.model";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";
import { ObjectId } from "mongoose";

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

function parseCustomDate(dateString: string, timeString: string): Date {
    // Example date format: "Friday, November 18, 2024"
    const [, month, day, year] = dateString.split(" ");
    const monthIndex = new Date(Date.parse(month + " 1")).getMonth(); // Get month index

    // Construct a new date object
    return new Date(parseInt(year), monthIndex, parseInt(day), ...timeString.split(":").map(Number));
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

    return events.map((event) => {
      const eventObject = event.toObject();

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
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching all events: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while fetching events');
    }
  }
}
