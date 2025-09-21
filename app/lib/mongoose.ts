"use server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) return console.log("Already Connected to MongoDB");

  try {
    const mongoLink = process.env.MONGODB_URL as string;
    if (!mongoLink) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(mongoLink);

    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error; // Throw error in production
  }
};
