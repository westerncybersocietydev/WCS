"use server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Event from "../models/event.model";
import { connectToDB } from "../mongoose";
import { EventObject } from "./event.action";
import { sendEmail } from "../../utils/email";

function formatDateToLocalISOString(dateStr: string, timeStr: string): string {
  if (dateStr === "TBD" || timeStr === "TBD") {
    console.warn(`Date or time is TBD. Date: ${dateStr}, Time: ${timeStr}`);
    return "";
  }

  // Split the date string (e.g., 'Friday, November 18, 2024') into its components
  const [, month, day, year] = dateStr.split(" ");

  // Create a full date string that JavaScript's Date object can parse (e.g., 'November 18, 2024 10:30')
  const fullDateStr = `${month} ${day.replace(",", "")}, ${year} ${timeStr}`;

  // Create a new Date object in the user's local time zone
  const date = new Date(fullDateStr);

  // Ensure the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", fullDateStr);
    return "";
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

const JWT_SECRET = process.env.JWT_SECRET || "";
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create user: ${errorMessage}`);
  }
}

export async function loginUser(
  uwoEmail: string,
  password: string
): Promise<string> {
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
      { expiresIn: "1h" }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Login failed: ${errorMessage}`);
  }
}

export async function getNameAndUserId(uwoEmail: string): Promise<MinData> {
  try {
    await connectToDB();

    // Find the user by ID
    const user = await User.findOne({ uwoEmail });

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      firstName: user.firstName,
      preferredEmail: user.preferredEmail,
      uwoEmail: user.uwoEmail,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Couldn't get profile: ${errorMessage}`);
  }
}

export async function getProfile(userId: string): Promise<ProfileData> {
  try {
    // Production mode - real database lookup required

    // Validate userId input
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      throw new Error("Valid user ID is required.");
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId.trim())) {
      throw new Error("Invalid user ID format.");
    }

    await connectToDB();

    // Find the user by ID
    const user = await User.findById(userId.trim());

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
      avatar: user.avatar,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
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
  avatar: string
): Promise<void> {
  try {
    // Validate userId input
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      throw new Error("Valid user ID is required.");
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId.trim())) {
      throw new Error("Invalid user ID format.");
    }

    // Validate required fields
    if (!firstName || !lastName || !uwoEmail || !currentYear || !program) {
      throw new Error("All required fields must be provided.");
    }

    await connectToDB();

    // Find the user by ID
    const user = await User.findById(userId.trim());

    if (!user) {
      throw new Error("User not found.");
    }

    if (avatar) {
      console.log(avatar);
    } else {
      console.log("I GOT NOTHING");
    }

    // Update user data
    user.firstName = firstName;
    user.lastName = lastName;
    user.uwoEmail = uwoEmail;
    user.preferredEmail = preferredEmail;
    user.currentYear = currentYear;
    user.program = program;
    (user.description = description), (user.avatar = avatar);

    await user.save();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Couldn't update user: ${errorMessage}`);
  }
}

export async function resetPassword(
  uwoEmail: string,
  newPassword: string
): Promise<void> {
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Couldn't update password: ${errorMessage}`);
  }
}

export async function updatePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Couldn't update plan: ${errorMessage}`);
  }
}

export async function eventRSVP(
  userId: string,
  eventId: string
): Promise<void> {
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
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
        const formattedDate = formatDateToLocalISOString(
          eventObject.date,
          eventObject.time
        );

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
        if (!a.formattedDate) return 1;
        if (!b.formattedDate) return -1;
        return a.formattedDate.localeCompare(b.formattedDate);
      });

    return transformedEvents;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
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

    const emailPromises = users.map(
      async (user: {
        preferredEmail: string;
        uwoEmail: string;
        firstName: string;
      }) => {
        const emailDetails = {
          from: "info@westerncybersociety.ca",
          to:
            user.preferredEmail.trim() === ""
              ? user.uwoEmail
              : user.preferredEmail,
          subject: "Free Professional Headshots at CTS 📸",
          message: `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>CTS Headshots</title>
            </head>

            <body style="margin:0; padding:0; background-color:#f5f5f7; font-family: Arial, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0"
                                style="background:#ffffff; padding:40px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                                <tr>
                                    <td style="font-size:18px; line-height:1.7; color:#1d1d1f;">
                                        <p>Dear <strong>${user.firstName}</strong>,</p>

                                        <p style="font-size:20px; font-weight:600;">
                                            Enhance your professional presence with a complimentary headshot!
                                        </p>

                                        <p>
                                            Join us at CTS for a <strong>professional headshot session at no cost</strong>. 
                                            
                                            This is a great opportunity to refresh your LinkedIn profile or professional portfolio.
                                        </p>

                                        <p style="margin:24px 0;">
                                            📍 <strong>ACEB 2448</strong><br />
                                            🗓 <strong>January 22, 2026</strong><br />
                                            ⏰ <strong>12:00 – 3:00 PM</strong>
                                        </p>

                                        <p>
                                            Professional attire is recommended. Blazers and ties will be available if needed. We
                                            look forward to seeing you.
                                        </p>

                                        <p style="margin-top:32px;">
                                            See you there, <br />
                                            Western Cyber Society
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style="font-size:12px; color:#86868b; text-align:center; padding-top:30px; border-top:1px solid #e0e0e2;">
                                        © 2026 Western Cyber Society. All rights reserved.
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

        await sendEmail(emailDetails);
        console.log("Email sent to:", user.firstName);
      }
    );

    await Promise.all(emailPromises);
    console.log("All CTS headshot emails sent successfully!");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Couldn't send emails: ${errorMessage}`);
  }
}


export async function getAllUsers(): Promise<
  {
    firstName: string;
    lastName: string;
    program: string;
    year: string;
    plan: string;
  }[]
> {
  try {
    await connectToDB();

    // Fetch all users
    const users = await User.find().select(
      "firstName lastName program currentYear plan"
    );

    // Transform users to the desired format
    return users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      program: user.program,
      year: user.currentYear,
      plan: user.plan,
    }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
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

export async function checkVIP(userId: string): Promise<boolean> {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    console.log(user.plan);
    if (user.plan === "VIP") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("User not found.", error);
    return false;
  }
}

export async function getEventRsvps(
  eventId: string
): Promise<{ firstName: string; lastName: string; plan: string }[]> {
  try {
    // Validate eventId input
    if (!eventId || typeof eventId !== "string" || eventId.trim() === "") {
      throw new Error("Valid event ID is required.");
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(eventId.trim())) {
      throw new Error("Invalid event ID format.");
    }

    // Connect to the database
    await connectToDB();

    // Find users who have RSVP'd for the given event
    const users = await User.find({ myEvents: eventId.trim() })
      .select("firstName lastName plan") // Select only the necessary fields
      .lean(); // Return plain JavaScript objects for better performance

    // If no users are found, return an empty array
    if (!users.length) {
      return [];
    }

    // Return the list of users with the selected fields
    return users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      plan: user.plan,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching event RSVPs: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching event RSVPs");
    }
  }
}

export async function getAllEventRsvps(): Promise<
  {
    eventName: string;
    rsvps: { firstName: string; lastName: string; plan: string }[];
  }[]
> {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch all event IDs
    const events = await Event.find();

    // Initialize an array to store RSVPs for each event
    const allRsvps = [];

    for (const event of events) {
      // Fetch RSVPs for the current event
      const users = await User.find({ myEvents: event._id })
        .select("firstName lastName plan") // Select necessary fields
        .lean(); // Return plain JavaScript objects

      // Add the event and its RSVPs to the result array
      allRsvps.push({
        eventName: event.name,
        rsvps: users.map((user) => ({
          firstName: user.firstName,
          lastName: user.lastName,
          plan: user.plan,
        })),
      });
    }

    // Return the consolidated data
    return allRsvps;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching RSVPs for all events: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching event RSVPs");
    }
  }
}

export async function upgradeToVIP(userId: string): Promise<void> {
  try {
    await connectToDB();

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Update the user's plan to VIP
    user.plan = "VIP";
    await user.save();

    console.log(`User ${userId} upgraded to VIP successfully`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to upgrade user to VIP: ${errorMessage}`);
  }
}
