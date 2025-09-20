"use server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) return console.log("Already Connected to MongoDB");

  try {
    // DEV MODE - Skip MongoDB connection in development
    if (process.env.NODE_ENV === "development" && !process.env.MONGODB_URL) {
      console.log("🚀 DEV MODE: Skipping MongoDB connection");
      isConnected = true;
      return;
    }

    const mongoLink = process.env.MONGODB_URL as string;
    if (!mongoLink) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(mongoLink);

    isConnected = true;

    console.log("Connected to MongoDB");
    NextResponse.json(
      { message: "Database connection tested" },
      { status: 200 }
    );
  } catch (error) {
    console.log("MongoDB connection error:", error);
    // Don't throw error in dev mode
    if (process.env.NODE_ENV === "development") {
      console.log("🚀 DEV MODE: Continuing without MongoDB");
      isConnected = true;
    }
  }
};
