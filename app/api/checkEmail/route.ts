import User from '@/app/lib/models/user.model';
import { connectToDB } from '@/app/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Define the handler function for the GET request
const handler = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectToDB();
        const { uwoEmail } = await req.json();
        // Check if user with this email already exists
        const existingUser = await User.findOne({ uwoEmail });

        if (!existingUser) {
            console.log("Email not used.")
            return NextResponse.json(false, { status: 200 });   
        }
        console.log("Email used.")
        return NextResponse.json(true, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: `Failed to fetch user data: ${error.message}` }, { status: 500 });
    }
};

// Export the handler for the GET method
export const POST = handler;