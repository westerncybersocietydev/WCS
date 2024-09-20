"use server";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";

export interface EventObject {
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    price: string;
    description: string;
    image: string;
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

export async function getAllEvents(): Promise<EventObject[]> {
    try {
      await connectToDB();
      const events = await Event.find();
  
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