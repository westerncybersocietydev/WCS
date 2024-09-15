"use server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface ProfileData {
    firstName: string;
    lastName: string;
    uwoEmail: string;
    preferredEmail: string;
    currentYear: string;
    program: string;
    plan?: string;
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
): Promise<void> {
    try {
        await connectToDB();

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        // Update user data
        user.firstName = firstName;
        user.lastName = lastName;
        user.uwoEmail = uwoEmail;
        user.preferredEmail = preferredEmail;
        user.currentYear = currentYear;
        user.program = program;

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
