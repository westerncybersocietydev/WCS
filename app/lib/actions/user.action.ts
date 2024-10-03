"use server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";
import { EventObject } from './event.action';

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

interface ProfileData {
    firstName: string;
    lastName: string;
    uwoEmail: string;
    preferredEmail: string;
    currentYear: string;
    program: string;
    plan: string;
    description: string;
    avatar: string;
}

const JWT_SECRET = process.env.JWT_SECRET || '';
const SALT_ROUNDS = 10;

export async function createUser(
    firstName: string,
    lastName: string,
    uwoEmail: string,
    preferredEmail: string,
    currentYear: string,
    program: string,
    plan: string,
    password: string
): Promise<string> {
    try {
        await connectToDB();

        // Check if user with this email already exists
        const existingUser = await User.findOne({ uwoEmail });

        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            firstName,
            lastName,
            uwoEmail,
            preferredEmail,
            currentYear,
            program,
            plan,
            password: hashedPassword,
        });
        await newUser.save();

        // Log in the user and return the token
        return await loginUser(uwoEmail, password);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to create user: ${errorMessage}`);
    }
}

export async function loginUser(uwoEmail: string, password: string): Promise<string> {
    try {
        await connectToDB();

        // Find the user by email
        const user = await User.findOne({ uwoEmail });

        if (!user) {
            throw new Error("User not found.");
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid credentials.");
        }

        // Generate JWT token with expiration
        return jwt.sign(
            { userId: user._id, firstName: user.firstName },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Login failed: ${errorMessage}`);
    }
}

export async function getProfile(userId: string): Promise<ProfileData> {
    try {
        await connectToDB();

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            uwoEmail: user.uwoEmail,
            preferredEmail: user.preferredEmail,
            currentYear: user.currentYear,
            program: user.program,
            plan: user.plan,
            description: user.description,
            avatar: user.avatar
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Couldn't get profile: ${errorMessage}`);
    }
}

export async function updateBasic(
    userId: string,
    firstName: string,
    lastName: string,
    uwoEmail: string,
    preferredEmail: string,
    currentYear: string,
    program: string,
    description: string,
    avatar: string,
): Promise<void> {
    try {
        await connectToDB();

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        if (avatar) {
            console.log(avatar)
        } else {
            console.log("I GOT NOTHING")
        }

        // Update user data
        user.firstName = firstName;
        user.lastName = lastName;
        user.uwoEmail = uwoEmail;
        user.preferredEmail = preferredEmail;
        user.currentYear = currentYear;
        user.program = program;
        user.description = description,
        user.avatar = avatar

        await user.save();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Couldn't update user: ${errorMessage}`);
    }
}

export async function updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
        await connectToDB();

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        // Compare the provided old password with the stored hashed password
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            throw new Error("Old password is incorrect.");
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update user password
        user.password = hashedNewPassword;

        await user.save();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Couldn't update password: ${errorMessage}`);
    }
}

export async function updatePlan(userId: string, plan: string): Promise<void> {
    try {
        await connectToDB();

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        // Update user data
        user.plan = plan;

        await user.save();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Couldn't update plan: ${errorMessage}`);
    }
}

export async function eventRSVP(userId: string, eventId: string): Promise<void> {
    try {
        await connectToDB();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            throw new Error("Event not found.");
        }

        // Check if the event is already in the user's myEvents array
        if (!user.myEvents.includes(eventId)) {
            user.myEvents.push(eventId); // Add the eventId to myEvents
        }

        await user.save(); // Save the updated user
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Couldn't RSVP to event: ${errorMessage}`);
    }
}

export async function getMyEvents(userId: string): Promise<EventObject[]> {
    try {
      await connectToDB();
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error("User not found.");
      }
  
      // If the user has no events, return an empty array
      if (!user.myEvents || user.myEvents.length === 0) {
        return [];
      }
  
      // Fetch the events based on the event IDs in myEvents
      const events = await Event.find({ _id: { $in: user.myEvents } });
  
      // Transform events and sort by date
      const transformedEvents = events.map((event) => {
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
          formattedDate: formatDateToLocalISOString(eventObject.date, eventObject.time), // Use the format function
        };
      });
  
      // Sort events by the formatted date
      return transformedEvents.sort((a, b) => a.formattedDate.localeCompare(b.formattedDate));
  
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Couldn't get events: ${errorMessage}`);
    }
  }  