import { sendEmail } from '../../utils/email'; // Adjust the import path as needed
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { emailDetails } = await req.json();

    // Assuming you have a sendEmail function in utils/email.ts
    await sendEmail(emailDetails);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error sending email' }, { status: 400 });
  }
}
