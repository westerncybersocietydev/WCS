"use server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

const JWT_SECRET = process.env.JWT_SECRET || ''
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

        // If no existing user, create a new one
        if (!existingUser) {
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
            const token = await loginUser(uwoEmail, password);
            return token;
        } else {
            throw new Error("User already exists");
        }
    } catch (error: any) {
        throw new Error(`Failed to create user :( ${error.message}`);
    }
}

export async function loginUser(uwoEmail: string, password: string): Promise<string> {
    try {
        // Ensure database is connected
        await connectToDB(); 

        // Find the user by email
        const user = await User.findOne({ uwoEmail });

        if (!user) {
            throw new Error("User not found");
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, firstName: user.firstName }, 
            JWT_SECRET, 
        );

        console.log("Login successful.")
        return token;

    } catch (error: any) {
        throw new Error(`Login failed :( ${error.message}`);
    }
}
