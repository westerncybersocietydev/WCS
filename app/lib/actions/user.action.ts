"use server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";
import { EventObject } from './event.action';
import { sendEmail } from '../../utils/email'; // Adjust the import path as needed

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

  export async function sendAllEmail(): Promise<void> {
    try {
      await connectToDB();
      const users = await User.find();
  
      if (users.length === 0) {
        throw new Error("No users found.");
      }
  
      // Prepare email sending promises
      const emailPromises = users.map(async (user: { preferredEmail: string; uwoEmail: string; firstName: string; }) => {
        const emailDetails = {
          from: "info@westerncybersociety.ca",
          to: user.preferredEmail.trim() === '' ? user.uwoEmail : user.preferredEmail,
          subject: 'Don’t Miss Out—SIP Prep Workshops Start Soon!',
          message: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Get Ahead with SIP Prep Workshops!</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f7;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td style="padding: 20px 0; line-height: 1.7; font-size: 18px;">
                                        <p>Hi <span style="color: #a723b0; font-weight: 600;">${user.firstName}</span>,</p>
                                        <p style="margin-bottom: 1em;">Ready to supercharge your tech skills? We know that sometimes coursework alone isn’t enough to keep up with the fast-paced tech world. That’s why we’re thrilled to invite you to our upcoming workshops, where we’ll dive into the hottest, most game-changing concepts in the industry.</p>
                                        <p style="margin-bottom: 2em;">This is your chance to learn, grow, and stay ahead of the curve. Whether you’re gearing up for the Student Innovation Projects or looking to explore exciting new tech frontiers, these workshops are designed to equip you with the tools for the future.</p>

<div style="display: flex; justify-content: center; align-items: center;">
    <a href="http://westerncybersociety.ca/events" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 10px 40px; border-radius: 50px; font-weight: 500; font-size: 18px; letter-spacing: 0.1em;">RSVP Now!</a>
</div>


                                        <p style="margin-top: 2em; margin-bottom: 1em;">We can’t wait to see you there and help you take your skills to the next level!</p>
                                        <p style="margin-bottom: -1em;">Keep innovating,</p>
                                        <p style="margin-bottom: 1em;">Western Cyber Society Team</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="margin-top: 40px;">
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
  
        // Send email
        await sendEmail(emailDetails);
        console.log("Email sent to: ", user.firstName)
      });
  
      // Wait for all emails to be sent
      await Promise.all(emailPromises);
      console.log("All emails sent successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Couldn't send emails: ${errorMessage}`);
    }
  }
  