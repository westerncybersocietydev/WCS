"use server";
import { connectToDB } from "@/app/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();
        
        return NextResponse.json({ message: "Database connection successful" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Database connection failed", error: error }, { status: 500 });
    }
}
