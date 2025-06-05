import { sendEmail } from '../../utils/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { emailDetails } = await req.json();

    await sendEmail(emailDetails);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error sending email' }, { status: 400 });
  }
}
