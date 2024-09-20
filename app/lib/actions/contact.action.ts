"use server";
import Contact from "../models/contact.model";
import { connectToDB } from "../mongoose";

export async function newInquiry(firstName: string, lastName: string, uwoEmail: string, message: string): Promise<void> {
  try {
    await connectToDB();

    if (!firstName || !lastName || !uwoEmail || !message) {
      throw new Error('All fields are required.');
    }

    const newContact = new Contact({ firstName, lastName, uwoEmail, message });
    await newContact.save();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error adding inquiry: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}