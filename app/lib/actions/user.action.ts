"use server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";
import { EventObject } from './event.action';
import { sendEmail } from '../../utils/email'; // Adjust the import path as needed

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

interface MinData {
    firstName: string;
    preferredEmail: string;
    uwoEmail: string;
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

export async function getNameAndUserId(uwoEmail: string): Promise<MinData> {
    try {
        await connectToDB();
        console.log("test")
        // Find the user by ID
        const user = await User.findOne({ uwoEmail });

        if (!user) {
            throw new Error("User not found.");
        }

        return {
            firstName: user.firstName,
            preferredEmail: user.preferredEmail,
            uwoEmail: user.uwoEmail
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Couldn't get profile: ${errorMessage}`);
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

export async function resetPassword(uwoEmail: string, newPassword: string): Promise<void> {
    try {
        await connectToDB();

        // Find the user by ID
        const user = await User.findOne({ uwoEmail });

        if (!user) {
            throw new Error("User not found.");
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

      // Transform events, filter for upcoming events, and sort by date
      const transformedEvents = events
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
            formattedDate: formattedDate,
          };
        })
        // Sort events by the formatted date
        .sort((a, b) => {
          if (!a.formattedDate) return 1; // 'a' is TBD, move it after 'b'
          if (!b.formattedDate) return -1; // 'b' is TBD, move it after 'a'
          return a.formattedDate.localeCompare(b.formattedDate);
        });
  
      return transformedEvents;
  
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
          subject: 'Join Us for the IBM Workshop!',
          message: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Join Us for the IBM Workshop!</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f7;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td style="padding: 20px 0; line-height: 1.7; font-size: 18px;">
                                        <p>Hi <span style="color: #a723b0; font-weight: 600;">${user.firstName}</span>,</p>
                                        <p style="margin-bottom: 1em;">We are excited to invite you to our IBM Workshop featuring special guest <strong>Donald J. Clarke</strong>, a senior zSystems technical specialist from IBM Technology!</p>
                                        <p style="margin-bottom: 2em;">Join us today, October 23, 2024, at 6:30 PM in Spencer Engineering Building (SEB) 2202 for an engaging session where you can enhance your skills and explore innovative technologies in the industry.</p>

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

  export async function getAllUsers(): Promise<{ firstName: string; lastName: string; program: string; year: string, plan: string }[]> {
    try {
        await connectToDB();

        // Fetch all users
        const users = await User.find().select('firstName lastName program currentYear plan');

        // Transform users to the desired format
        return users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            program: user.program,
            year: user.currentYear,
            plan: user.plan
        }));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Couldn't get all users: ${errorMessage}`);
    }
}

export async function checkAdmin(password: string): Promise<boolean> {
    try {
        if (password === process.env.ADMIN_PASSWORD) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking admin password:", error);
        return false;
    }
}

export async function getEventRsvps(eventId: string): Promise<{ firstName: string; lastName: string; plan: string }[]> {
  try {
    // Connect to the database
    await connectToDB();

    // Find users who have RSVP'd for the given event
    const users = await User.find({ myEvents: eventId })
      .select('firstName lastName plan') // Select only the necessary fields
      .lean(); // Return plain JavaScript objects for better performance

    // If no users are found, return an empty array
    if (!users.length) {
      return [];
    }

    // Return the list of users with the selected fields
    return users.map(user => ({
      firstName: user.firstName,
      lastName: user.lastName,
      plan: user.plan,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching event RSVPs: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while fetching event RSVPs');
    }
  }
}
